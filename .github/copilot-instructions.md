# GitHub Copilot Instructions for {{ pluginName }}

## 📚 Complete Documentation

**For comprehensive implementation guides, always refer to:**

**[Architecture & Skills Documentation](skills/README.md)**

### Documentation by Layer

**📂 Canvas** - Figma API operations
- [Figma API](skills/canvas/figma-api.md)
- [Data Storage](skills/canvas/data-storage.md)

**🌉 Bridge** - Communication layer
- [Communication Pattern](skills/bridge/communication-pattern.md)
- [Bridge Functions](skills/bridge/bridge-functions.md)

**⚙️ Config** - Build & quality
- [Global Config](skills/config/global-config.md)
- [Feature Flags](skills/config/feature-flags.md)
- [Credits System](skills/config/credits-system.md)
- [Vite Build](skills/config/vite-build.md)
- [Code Quality](skills/config/code-quality.md)

**🎨 UI** - Preact application
- [Component Library](skills/ui/component-library.md)
- [Component Patterns](skills/ui/component-patterns.md)
- [External Services](skills/ui/external-services.md)
- [State Management](skills/ui/state-management.md)
- [Internationalization](skills/ui/i18n.md)
- [Types System](skills/ui/types-system.md)
- [Error Handling](skills/ui/error-handling.md)
- [CSS & Theming](skills/ui/css-theming.md)
- [Accessibility](skills/ui/accessibility.md)
- [Performance](skills/ui/performance.md)
- [App Bootstrap](skills/ui/app-bootstrap.md)
**🔌 Externals**
- [Implement Design](skills/externals/implement-design) — Figma spec document → code workflow (annotations, MCP, unoff-ui)
- [Payment Systems](skills/externals/payment-systems.md) — Figma built-in payments vs Lemon Squeezy — interstitial options, license key flow. **Must choose one before shipping**

---

## Project Architecture

This is a Figma plugin built with TypeScript, Preact (aliased via preact/compat), and Vite. Uses PureComponent class components + HOCs. Nanostores for lightweight state. Separates Canvas logic (Figma API) from UI logic (Preact).

## Directory Structure

### Root Files
- `.eslintrc.json`, `.prettierrc.json` - Code quality
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Build config
- `manifest.json` - Figma plugin manifest

### `/src/bridges/` - Figma Canvas Integration
**Purpose**: Interact with Figma Canvas API (nodes, styles, variables, storage)

**Key File**: `loadUI.ts` - Message router between UI and Canvas

**Subdirectories**: `/checks/` (validations), `/plans/` (subscriptions)

**See**: [Figma API Guide](skills/canvas/figma-api.md) • [Bridge Functions](skills/bridge/bridge-functions.md)

### `/src/app/` - React UI Application

#### Core
- `index.tsx` - Entry point
- `config/` - Contexts (Config, Theme)
- `content/` - Assets, i18n

#### Key Directories
- **`external/`** - External services (auth, cms, license, monitoring, tracking)
- **`stores/`** - Nanostores atoms ($prefix convention)
- **`types/`** - TypeScript definitions
- **`ui/`** - React components
  - `App.tsx` - Main component
  - `components/` - Reusable components
  - `contexts/` - Context providers
  - `modules/` - Feature modules
  - `stylesheets/` - CSS files
- **`utils/`** - UI utilities
  - **`pluginMessage.ts`** ⭐ - UI → Canvas communication

**See**: [Component Library](skills/ui/component-library.md) • [Component Patterns](skills/ui/component-patterns.md) • [State Management](skills/ui/state-management.md)

### `/src/utils/` - Global Utilities
Shared utilities (`i18n.ts`, `setData.ts`)

## UI Component Library

**⚠️ ALWAYS use `@unoff/ui` and `@unoff/utils`**

### Standard Imports
```typescript
import { doClassnames, FeatureStatus } from '@unoff/utils'
import { Bar, Button, Dropdown, Icon, Input, Menu, layouts, texts } from '@unoff/ui'
```

### FeatureStatus Pattern
```typescript
static features = (planStatus, config, service, editor) => ({
  FEATURE: new FeatureStatus({
    features: config.features,
    featureName: 'FEATURE',
    planStatus, currentService: service, currentEditor: editor
  })
})

// Methods: .isActive() .isBlocked() .isReached(count) .isNew()
```

**For complete component examples and patterns** → [Component Library](skills/ui/component-library.md)

## Communication Pattern: UI ↔ Canvas

### Architecture Flow
```
UI Component → sendPluginMessage() → loadUI.ts → Bridge Functions → Figma API
              (pluginMessage.ts)       (router)                         
```

### UI → Canvas
```typescript
import { sendPluginMessage } from '../utils/pluginMessage'
sendPluginMessage({ pluginMessage: { type: 'ACTION', data: {...} } })
```

### Canvas → UI
```typescript
// In loadUI.ts or bridge files
figma.ui.postMessage({ type: 'RESULT', data: {...} })

// In UI component
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    const msg = event.data.pluginMessage
    if (msg?.type === 'RESULT') { /* handle */ }
  }
  window.addEventListener('message', handleMessage)
  return () => window.removeEventListener('message', handleMessage)
}, [])
```

### Message Naming Convention
- UI → Canvas: `VERB_NOUN` (e.g., `CREATE_NODE`)
- Canvas → UI: `NOUN_PAST_TENSE` (e.g., `NODE_CREATED`)

**For complete communication patterns** → [Communication Pattern](skills/bridge/communication-pattern.md)

## External Services

{{#isSupabaseEnabled}}
- **Supabase**: `/src/app/external/auth/` - Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLIC_ANON_KEY`
{{/isSupabaseEnabled}}
{{#isSentryEnabled}}
- **Sentry**: `/src/app/external/monitoring/` - Env: `VITE_SENTRY_DSN`
{{/isSentryEnabled}}
{{#isMixpanelEnabled}}
- **Mixpanel**: `/src/app/external/tracking/` - Env: `VITE_MIXPANEL_TOKEN`
{{/isMixpanelEnabled}}

**For complete setup guides** → [External Services](skills/ui/external-services.md)

## Code Style Guidelines

### TypeScript
- Strict mode always
- `interface` for objects, `type` for unions
- No `any` types

### Preact
- PureComponent class components (NOT functional)
- HOCs: WithConfig (class-based) + WithTranslation (functional wrapper)
- `forceUpdate()` for language changes
- Nanostores atoms with `$prefix` convention

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Functions | camelCase | `getUserData()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Types | PascalCase | `UserData` |

## When Adding New Features

1. **Define Types** in `/src/app/types/`
2. **Create Bridge Logic** in `/src/bridges/`
3. **Build UI Components** in `/src/app/ui/`
4. **Add Message Handlers** (UI ↔ Canvas)
5. **Update Config** (`global.config.ts`)
6. **Add Translations** in `/src/app/content/translations/`

## Performance Best Practices

- `PureComponent` for shallow comparison render optimization
- Remove DOM for inactive features (not `display: none`)
- Conditional service init (Sentry/Mixpanel only in production)
- Singleton pattern for external service clients
- Build: `viteSingleFile` (zero network requests), platform CSS stripping
- Batch Figma operations
- See [Performance Guide](skills/ui/performance.md) for full patterns

---

**Remember**: Two separate contexts (Canvas/UI). Always communicate via messages. Refer to skills documentation for detailed patterns and examples.