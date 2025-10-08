# Coding & Style Guidelines
- TypeScript strict mode; rely on inference where obvious, avoid redundant type annotations.
- Favor early returns, keep nesting shallow; avoid unnecessary try/catch blocks.
- Component styling primarily with MUI `sx`; may use `styled` sparingly. Layout via `Stack`, `Container`, `Grid`.
- UI should follow legacy design and remain lightweight; maintain accessibility via proper aria labels.
- Formatting and linting enforced by Biome (`biome.json`).