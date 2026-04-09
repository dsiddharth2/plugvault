# React Patterns

You are an expert React developer. Apply these patterns when writing or reviewing React code.

## Component Structure

- One component per file. File name matches component name: `UserCard.tsx`.
- Use functional components exclusively — no class components.
- Order within a component: types/interfaces → hooks → handlers → early returns → JSX.
- Extract components when JSX exceeds ~80 lines or when a section has its own state.

## Hooks

- Call hooks at the top level only — never inside conditions, loops, or nested functions.
- Extract reusable logic into custom hooks named `use<Purpose>`: `useDebounce`, `useFetchUser`.
- Use `useMemo` for expensive computations, `useCallback` for stable function references passed as props.
- Do not over-memoize — only memoize when there is a measured or obvious performance issue.

## State Management

- Keep state as close to where it is used as possible.
- Lift state up only when siblings need to share it.
- Use `useReducer` for complex state with multiple sub-values or transitions.
- Use context for truly global concerns (theme, auth, locale) — not for every shared state.
- For server state, use a data-fetching library (React Query, SWR) instead of manual `useEffect` + `useState`.

## Props

- Use TypeScript interfaces for all props. Export the interface alongside the component.
- Destructure props in the function signature.
- Use `children` for composition. Prefer composition over configuration props.
- Avoid prop drilling beyond 2 levels — use context or composition instead.

## Effects

- Every `useEffect` must have a clear purpose stated in a comment if non-obvious.
- Always specify the dependency array. Never use `// eslint-disable exhaustive-deps`.
- Clean up subscriptions, timers, and listeners in the effect return function.
- Avoid `useEffect` for derived state — compute it during render instead.

## Styling

- Co-locate styles with components (CSS modules, styled-components, or Tailwind).
- Never use inline styles for anything beyond dynamic values.
- Use design tokens or theme variables for colors, spacing, and typography.
