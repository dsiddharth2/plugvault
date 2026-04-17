#!/usr/bin/env node
// build-community-index.js — scans community vaults and builds community-index.json
// Zero npm dependencies: uses only Node.js built-ins (https, fs, path)

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const reqHeaders = {
      'User-Agent': 'plugvault-indexer',
      ...headers,
    };
    if (process.env.GITHUB_TOKEN) {
      reqHeaders['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const req = https.get({ hostname: opts.hostname, path: opts.pathname + opts.search, headers: reqHeaders, timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
    req.on('error', reject);
  });
}

async function fetchJSON(url) {
  const { status, body } = await httpsGet(url);
  if (status === 404) return null;
  if (status !== 200) throw new Error(`HTTP ${status} for ${url}`);
  return JSON.parse(body);
}

async function fetchText(url) {
  const { status, body } = await httpsGet(url);
  if (status === 404) return null;
  if (status !== 200) throw new Error(`HTTP ${status} for ${url}`);
  return body;
}

// ---------------------------------------------------------------------------
// YAML frontmatter parser (minimal — handles string/array values)
// ---------------------------------------------------------------------------

function parseFrontmatter(text) {
  if (!text || !text.startsWith('---')) return { meta: {}, body: text || '' };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: text };
  const raw = text.slice(4, end);
  const body = text.slice(end + 4).trimStart();
  const meta = {};
  for (const line of raw.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (!key) continue;
    // Detect inline list: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = val.replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body };
}

// ---------------------------------------------------------------------------
// Dependency inference
// ---------------------------------------------------------------------------

function inferDependencies(bodyText, depPattern) {
  const deps = [];
  let m;
  depPattern.lastIndex = 0;
  while ((m = depPattern.exec(bodyText)) !== null) {
    deps.push({ vault: m[1], name: m[2] });
  }
  return deps;
}

// ---------------------------------------------------------------------------
// Build directory→files map from git tree
// ---------------------------------------------------------------------------

function buildDirMap(treeItems) {
  const map = {};
  for (const item of treeItems) {
    if (item.type !== 'blob') continue;
    const dir = path.posix.dirname(item.path);
    if (!map[dir]) map[dir] = [];
    map[dir].push(item.path);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Detect entry points
// ---------------------------------------------------------------------------

function detectEntryPoints(treeItems) {
  const entries = [];
  for (const item of treeItems) {
    if (item.type !== 'blob') continue;
    const p = item.path;

    // SKILL.md anywhere
    if (p === 'SKILL.md' || p.endsWith('/SKILL.md')) {
      const dir = path.posix.dirname(p);
      const name = dir === '.' ? 'root' : path.posix.basename(dir);
      entries.push({ path: p, type: 'skill', dirHint: dir, name });
      continue;
    }

    // agents/*.md — direct child only
    const agentMatch = p.match(/^agents\/([^/]+\.md)$/);
    if (agentMatch) {
      entries.push({ path: p, type: 'agent', dirHint: 'agents', name: null, filename: agentMatch[1] });
      continue;
    }

    // commands/*.md — direct child only
    const commandMatch = p.match(/^commands\/([^/]+\.md)$/);
    if (commandMatch) {
      entries.push({ path: p, type: 'command', dirHint: 'commands', name: null, filename: commandMatch[1] });
      continue;
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Process a single vault
// ---------------------------------------------------------------------------

async function processVault(vault, plugDeps, depPattern) {
  const urlParts = new URL(vault.url);
  const [, owner, repoName] = urlParts.pathname.split('/');
  const vaultName = vault.name;
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repoName}/main/`;
  const apiTreeUrl = `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`;

  process.stderr.write(`[${vaultName}] Fetching git tree...\n`);
  const treeData = await fetchJSON(apiTreeUrl);
  if (!treeData || !treeData.tree) {
    process.stderr.write(`[${vaultName}] No tree data, skipping.\n`);
    return [];
  }

  const treeItems = treeData.tree;
  const dirMap = buildDirMap(treeItems);
  const entryPoints = detectEntryPoints(treeItems);

  process.stderr.write(`[${vaultName}] Found ${entryPoints.length} entry points.\n`);

  const results = [];

  for (const ep of entryPoints) {
    const rawUrl = rawBase + ep.path;
    process.stderr.write(`[${vaultName}] Fetching ${ep.path}...\n`);
    const rawContent = await fetchText(rawUrl);
    if (!rawContent) {
      process.stderr.write(`[${vaultName}] 404 for ${ep.path}, skipping.\n`);
      continue;
    }

    const { meta, body } = parseFrontmatter(rawContent);

    if (!meta.description) {
      process.stderr.write(`[${vaultName}] No description in ${ep.path}, skipping.\n`);
      continue;
    }

    // Resolve name: frontmatter > hint from path > filename stem
    let entryName = meta.name || ep.name;
    if (!entryName && ep.filename) {
      entryName = ep.filename.replace(/\.md$/, '');
    }

    const directory = ep.dirHint === '.' ? '' : ep.dirHint;
    let filesInDir = [];
    if (directory === '') {
      filesInDir = Object.values(dirMap).flat();
    } else {
      const prefix = directory + '/';
      for (const [dir, files] of Object.entries(dirMap)) {
        if (dir === directory || dir.startsWith(prefix)) {
          filesInDir.push(...files);
        }
      }
    }
    if (filesInDir.length === 0) filesInDir = [ep.path];

    // Dependencies — Pass A (curated)
    const curatedRaw = plugDeps[entryName] || [];
    const dependencies = curatedRaw.map((dep) => ({ ...dep, source: 'curated' }));
    const curatedNames = new Set(dependencies.map((d) => d.name));

    // Dependencies — Pass B (inferred)
    const inferred = inferDependencies(body, depPattern);
    for (const dep of inferred) {
      if (!curatedNames.has(dep.name)) {
        dependencies.push({
          name: dep.name,
          type: 'skill',
          vault: dep.vault,
          required: true,
          source: 'inferred',
        });
        curatedNames.add(dep.name);
      }
    }

    results.push({
      name: entryName,
      type: ep.type,
      vault: vaultName,
      vaultUrl: `${urlParts.origin}/${owner}/${repoName}`,
      entry: ep.path,
      directory: directory || '.',
      files: filesInDir,
      rawBaseUrl: rawBase,
      description: meta.description,
      version: meta.version || null,
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
      dependencies,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const vaultsPath = path.join(repoRoot, 'community-vaults.json');
  const outputPath = path.join(repoRoot, 'community-index.json');

  const vaults = JSON.parse(fs.readFileSync(vaultsPath, 'utf8'));
  const vaultNames = vaults.map(v => v.name);
  const vaultNamesPattern = vaultNames.join('|');
  const depPattern = new RegExp(`(${vaultNamesPattern}):([\\w-]+)`, 'g');
  const packages = [];

  for (const vault of vaults) {
    process.stderr.write(`\n=== Processing vault: ${vault.name} ===\n`);

    // Fetch plug-deps.json for this vault (graceful 404)
    const urlParts = new URL(vault.url);
    const [, owner, repoName] = urlParts.pathname.split('/');
    const depsUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/main/plug-deps.json`;
    process.stderr.write(`[${vault.name}] Fetching plug-deps.json...\n`);
    const plugDeps = (await fetchJSON(depsUrl)) || {};

    const entries = await processVault(vault, plugDeps, depPattern);
    packages.push(...entries);
    process.stderr.write(`[${vault.name}] Contributed ${entries.length} packages.\n`);
  }

  const output = {
    updatedAt: new Date().toISOString(),
    packages,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  process.stderr.write(`\nWrote ${packages.length} packages to community-index.json\n`);
}

main().catch((err) => {
  process.stderr.write(`ERROR: ${err.message}\n${err.stack}\n`);
  process.exit(1);
});
