# Agent Guidelines for Charger Extension

## Commands
- **Build**: `pnpm build` (Chrome) or `pnpm build:firefox`
- **Dev**: `pnpm dev` (Chrome) or `pnpm dev:firefox`
- **Type Check**: `pnpm compile`
- **No test framework** - run full build to verify

## Code Style
- **Files**: kebab-case for content scripts (`site.content.ts`)
- **Functions/Variables**: camelCase
- **Content Scripts**: Use `defineContentScript({ matches: [...], main() { ... } })`
- **Event Handling**: Document listeners with typing checks (`activeElement?.tagName === "INPUT"`)
- **Platform Detection**: `/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)`
- **Error Handling**: Try-catch with `console.error`, graceful fallbacks
- **User Feedback**: Style flashes (`element.style.backgroundColor = "#4CAF50"`)
- **Imports**: Minimal, rely on WXT globals
- **Comments**: Only for complex logic, avoid noise
- **Formatting**: Consistent indentation, multi-line chains