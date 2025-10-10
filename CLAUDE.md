# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-website browser extension that provides custom shortcuts and productivity enhancements for various web applications. Built with WXT framework using Chrome Manifest V3, designed to easily add new website-specific functionality.

## Architecture

### WXT Framework
- **Build System**: WXT automatically generates manifest.json and bundles content scripts from the `entrypoints/` directory
- **Naming Convention**: Files ending in `.content.ts` are automatically registered as content scripts
- **Auto-Configuration**: Match patterns defined in each content script are automatically added to manifest
- **Hot Reload**: Development mode supports automatic extension reload

### Content Scripts Pattern
Each website gets its own content script in `entrypoints/`:
- Format: `{website-name}.content.ts`
- Each file exports `defineContentScript()` with `matches` array for URL patterns
- Scripts are self-contained with website-specific logic

**Current Implementations**:
- `gmail.content.ts` - Keyboard shortcuts for email navigation and account switching
- `platzi.content.ts` - Double-click to copy specific content elements

### Adding New Website Scripts

1. Create `entrypoints/{website}.content.ts`
2. Use this structure:
```typescript
export default defineContentScript({
  matches: ["*://example.com/*"],
  main() {
    // Your website-specific functionality
  },
});
```
3. Run `pnpm build` - automatically included in manifest
4. No manual configuration needed

## Development Commands

```bash
# Development (Chrome, with hot reload)
pnpm dev

# Development (Firefox)
pnpm dev:firefox

# Production build (Chrome)
pnpm build

# Production build (Firefox)
pnpm build:firefox

# Type checking
pnpm compile

# Package for distribution
pnpm zip
pnpm zip:firefox
```

## Build Output
- Output directory: `.output/chrome-mv3/` or `.output/firefox-mv3/`
- Content scripts: `.output/chrome-mv3/content-scripts/{name}.js`
- Manifest: Auto-generated from content script configurations

## Implementation Patterns

**URL Manipulation**: For navigation features, modify `window.location.href` directly (more reliable than DOM clicks)

**Platform Detection**: Use `navigator.userAgent` with regex patterns:
```typescript
const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
```

**Keyboard Shortcuts**: Use multi-modifier combinations to avoid browser conflicts (e.g., `Ctrl + Cmd + Key` on Mac)

**User Feedback**: Provide visual confirmation (color flash, console logs) for actions like clipboard copy

**Event Delegation**: Use document-level listeners with element matching for dynamic content
