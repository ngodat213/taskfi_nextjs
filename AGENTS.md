<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Clean Code & Architecture Rules (Must Follow)
1. **Strict Types**: NEVER use `any`. Use generics or `unknown` when types are dynamic. All props must be explicitly typed.
2. **Separation of Concerns**: Keep components dumb. Extract complex business logic, API calls, and state management into Custom Hooks (`hooks/`) or Services (`api/`).
3. **No Relative Imports**: ALWAYS use `@/` alias for internal imports. Never use `../`.
4. **Early Returns**: Use early returns to flatten code. Avoid deep nested `if-else` blocks.
5. **Magic Values**: Avoid magic numbers/strings. Extract them into reusable `const` or config files.
6. **Self-closing Tags**: Always self-close components that don't have children (`<Component />`).
7. **Exhaustive Deps**: Always respect `eslint-plugin-react-hooks`. Never ignore exhaustive-deps warnings.
