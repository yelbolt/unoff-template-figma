# Claude AI Rules for {{ pluginName }}

You are an expert Figma plugin developer working on a TypeScript/React project.

## 📚 Complete Documentation

For comprehensive, detailed documentation, refer to:

**[Architecture & Skills Documentation](skills/README.md)**

This documentation is organized into four main layers:

### 📂 Canvas - Figma API Layer
- **[Figma API](skills/canvas/figma-api.md)** - Node creation, styles, variables, selection, viewport
- **[Data Storage](skills/canvas/data-storage.md)** - Plugin Data, Shared Plugin Data, Client Storage, migration

### 🌉 Bridge - Communication Layer
- **[Communication Pattern](skills/bridge/communication-pattern.md)** - Architecture, message flow, type conventions, request-response
- **[Bridge Functions](skills/bridge/bridge-functions.md)** - Pure functions, loadUI.ts action map, check functions

### ⚙️ Config - Build & Quality Layer
- **[Global Config](skills/config/global-config.md)** - Config type, sections, env vars, service toggles
- **[Feature Flags](skills/config/feature-flags.md)** - FeatureStatus, doSpecificMode(), adding features
- **[Credits System](skills/config/credits-system.md)** - `$creditsCount` atom, `checkCredits.ts`, `limitsMapping`, `isReached()` → `isBlocked` pattern
- **[Vite Build](skills/config/vite-build.md)** - Dual build, Vite plugins, Preact aliasing
- **[Code Quality](skills/config/code-quality.md)** - ESLint, Prettier, TypeScript strict, Vitest

### 🎨 UI - Preact Application Layer
- **[Component Library](skills/ui/component-library.md)** - @unoff/ui guide, FeatureStatus, components
- **[Component Patterns](skills/ui/component-patterns.md)** - PureComponent, HOCs, BaseProps, createPortal
- **[External Services](skills/ui/external-services.md)** - Supabase, Sentry, Mixpanel, Tolgee
- **[State Management](skills/ui/state-management.md)** - Nanostores atoms, Context API, Client Storage sync
- **[Internationalization](skills/ui/i18n.md)** - Tolgee (UI) + createI18n (Canvas), ICU format
- **[Types System](skills/ui/types-system.md)** - Type files, BaseProps, unions, RecursiveKeyOf
- **[Error Handling](skills/ui/error-handling.md)** - try/catch, Sentry, POST_MESSAGE notifications
- **[CSS & Theming](skills/ui/css-theming.md)** - ThemeContext, CSS modules, tokens, responsive, z-index
- **[Accessibility](skills/ui/accessibility.md)** - `inert`, portals, keyboard, i18n accessibility
- **[Performance](skills/ui/performance.md)** - PureComponent, DOM removal, build optimizations
- **[App Bootstrap](skills/ui/app-bootstrap.md)** - Startup sequence, provider nesting, LOAD_DATA chain

### 🔌 Externals
- **[Implement Design](skills/externals/implement-design)** - Figma spec document → code workflow with annotations, MCP server integration, and unoff-ui component mapping
- **[Payment Systems](skills/externals/payment-systems.md)** - Figma built-in payments vs Lemon Squeezy — interstitial options, manifest config, license key flow. **Must choose one before shipping**

## Quick Reference

### Project Type
Figma Plugin with Preact UI and TypeScript

### Tech Stack
- TypeScript (strict mode)
- Preact (aliased as React via preact/compat)
- PureComponent class components + HOCs (WithConfig, WithTranslation)
- Nanostores (lightweight state, $prefix convention)
- Vite (dual build: UI HTML + Canvas IIFE)
- Figma Plugin API
- @unoff/ui (component library)
- @unoff/utils (utilities)
- Tolgee (UI translations) + createI18n (Canvas translations)
{{#isSupabaseEnabled}}
- Supabase (auth & database)
{{/isSupabaseEnabled}}
{{#isSentryEnabled}}
- Sentry (error monitoring)
{{/isSentryEnabled}}
{{#isMixpanelEnabled}}
- Mixpanel (analytics)
{{/isMixpanelEnabled}}

### Core Architecture

#### Two-Context System
1. **Canvas Context** (`/src/bridges/`) - Figma API access, no DOM
2. **UI Context** (`/src/app/`) - React UI, no direct Figma API
3. **Communication** - PostMessage via `sendPluginMessage()`

#### Key Files
- **`/src/bridges/loadUI.ts`** - Message router (Canvas ↔ UI)
- **`/src/app/utils/pluginMessage.ts`** - Send messages to Canvas
- **`/src/app/ui/App.tsx`** - Main React component

### Communication Pattern

```typescript
// UI → Canvas
import { sendPluginMessage } from '../utils/pluginMessage'

sendPluginMessage({
  pluginMessage: {
    type: 'CREATE_RECTANGLE',
    data: { width: 100, height: 100 }
  }
})

// Canvas → UI
figma.ui.postMessage({
  type: 'RECTANGLE_CREATED',
  data: { id: 'node-id' }
})
```

### Message Naming Convention
- UI → Canvas: `VERB_NOUN` (e.g., `CREATE_NODE`, `UPDATE_STYLE`)
- Canvas → UI: `NOUN_PAST_TENSE` (e.g., `NODE_CREATED`, `STYLE_UPDATED`)

## Critical Rules

### ✅ DO
- Separate UI and Canvas logic completely
- Use `sendPluginMessage()` for UI → Canvas communication
- Use `@unoff/ui` components (Button, Input, Dropdown, Menu, etc.)
- Use FeatureStatus for permission management
- Define TypeScript types for all messages
- Handle errors gracefully in bridge functions
- Refer to skills documentation for detailed patterns

### ❌ DON'T
- Mix Figma API calls in React components
- Mix React code in bridge files
- Use `parent.postMessage()` directly (use `sendPluginMessage()`)
- Create custom UI components when unoff-ui has them
- Skip error handling
- Use `any` type
- Hardcode values (use config or env vars)

## File Organization

```
/src/
├── bridges/              # Canvas logic (Figma API)
│   ├── loadUI.ts         # Message router ⭐
│   ├── checks/           # Validations
│   └── plans/            # Subscriptions
├── app/                  # UI logic (React)
│   ├── ui/               # React components
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── contexts/
│   │   └── modules/
│   ├── stores/           # Nanostores atoms
│   ├── external/         # Services (auth, tracking, etc.)
│   ├── types/            # TypeScript definitions
│   └── utils/
│       └── pluginMessage.ts  # UI → Canvas ⭐
└── utils/                # Global utilities
    └── i18n.ts
```

## When Generating Code

1. **Always check existing patterns** in the codebase
2. **Refer to skills documentation** for detailed implementation patterns
3. **Follow TypeScript strict mode** - No `any` types
4. **Use unoff-ui components** - Don't reinvent the wheel
5. **Add error handling** in all bridge functions
6. **Document public APIs** with JSDoc comments
7. **Test your implementation** following documented patterns

## Environment Variables

{{#isSupabaseEnabled}}
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLIC_ANON_KEY=xxxxx
```
{{/isSupabaseEnabled}}
{{#isSentryEnabled}}
```env
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```
{{/isSentryEnabled}}
{{#isMixpanelEnabled}}
```env
VITE_MIXPANEL_TOKEN=xxxxx
```
{{/isMixpanelEnabled}}

## Performance Best Practices

- Use `PureComponent` (shallow comparison prevents unnecessary renders)
- Remove DOM entirely for inactive features (not `display: none`)
- Conditional service initialization (Sentry/Mixpanel only in production)
- Singleton pattern for external service clients
- Build: `viteSingleFile` (zero network requests), platform CSS stripping
- Batch Figma operations when possible
- See [Performance Guide](skills/ui/performance.md) for full patterns

## Additional Resources

- **[Architecture Documentation](ARCHITECTURE.md)** - System architecture overview
- **[Skills Documentation](skills/README.md)** - Comprehensive implementation guides

---

**Remember**: This is a two-context architecture. Always keep Canvas and UI logic separate, and communicate through the message passing system documented in the skills.
