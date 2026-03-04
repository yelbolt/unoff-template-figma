# Figma Plugin Template Architecture

## Overview

This template is a Figma plugin built with **TypeScript**, **Preact** (aliased as React via `preact/compat`), and **Vite**. The architecture strictly separates Canvas logic (Figma API) from UI logic (Preact) through a message-based communication system.

## Full Documentation

For detailed documentation and implementation guides, see:

**[Architecture & Skills Documentation](skills/README.md)**

The documentation is organized into five layers:

- **Canvas** — Figma API operations ([figma-api.md](skills/canvas/figma-api.md), [data-storage.md](skills/canvas/data-storage.md))
- **Bridge** — UI ↔ Canvas communication ([communication-pattern.md](skills/bridge/communication-pattern.md), [bridge-functions.md](skills/bridge/bridge-functions.md))
- **Config** — Feature flags, credits, build system ([global-config.md](skills/config/global-config.md), [feature-flags.md](skills/config/feature-flags.md), [vite-build.md](skills/config/vite-build.md))
- **UI** — Preact application ([component-library.md](skills/ui/component-library.md), [component-patterns.md](skills/ui/component-patterns.md), [external-services.md](skills/ui/external-services.md), [state-management.md](skills/ui/state-management.md), [i18n.md](skills/ui/i18n.md))
- **Externals** — Integration workflows ([payment-systems.md](skills/externals/payment-systems.md))

### AI Tools Configuration

This project is configured to work with all major AI development tools:

| Tool | Configuration File | Description |
|------|-------------------|-------------|
| **GitHub Copilot** | `.github/copilot-instructions.md` | Guidelines for GitHub Copilot in VS Code |
| **Cursor** | `.cursor/rules/project.mdc` | Configuration for Cursor AI |
| **Windsurf** | `.windsurf/rules/project.md` | Configuration for Windsurf AI |
| **Claude (VS Code)** | `.claude/settings.json` | Configuration for Claude in VS Code |
| **Figma MCP** | `.vscode/mcp.json` `.cursor/mcp.json` `.windsurf/mcp.json` | MCP servers for Figma design-to-code |

All these files reference the full documentation in `skills/` as a single source of truth.

---

## Directory Structure

```
{{ pluginName }}/
├── .github/                    # GitHub configuration
│   ├── copilot-instructions.md # GitHub Copilot guidelines
│   ├── skills/                 # Detailed documentation by layer
│   │   ├── README.md           # Documentation index
│   │   ├── canvas/             # Canvas layer
│   │   │   ├── figma-api.md
│   │   │   └── data-storage.md
│   │   ├── bridge/             # Bridge layer
│   │   │   ├── communication-pattern.md
│   │   │   └── bridge-functions.md
│   │   ├── config/             # Config & build layer
│   │   │   ├── global-config.md
│   │   │   ├── feature-flags.md
│   │   │   ├── credits-system.md
│   │   │   ├── vite-build.md
│   │   │   └── code-quality.md
│   │   ├── ui/                 # UI layer
│   │   │   ├── component-library.md
│   │   │   ├── component-patterns.md
│   │   │   ├── external-services.md
│   │   │   ├── state-management.md
│   │   │   ├── i18n.md
│   │   │   ├── types-system.md
│   │   │   ├── error-handling.md
│   │   │   ├── css-theming.md
│   │   │   ├── accessibility.md
│   │   │   ├── performance.md
│   │   │   └── app-bootstrap.md
│   │   └── externals/          # External integrations
│   │       ├── implement-design # Figma spec → code workflow
│   │       └── payment-systems.md
│   ├── CODEOWNERS             # Code ownership
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── workflows/             # CI/CD workflows
├── .mcp.json                   # MCP servers (Figma remote + desktop)
├── .vscode/                    # VS Code settings
├── workers/                    # Cloudflare Workers (git submodules, optional)
│   ├── announcement-worker/    # unoff add announcement-worker
│   ├── auth-worker/            # unoff add auth-worker
│   └── cors-worker/            # unoff add cors-worker
├── src/
│   ├── bridges/               # Figma Canvas Layer
│   │   ├── loadUI.ts          # Message Router (central hub)
│   │   ├── checks/            # Validation functions
│   │   └── plans/             # Subscription management
│   ├── app/                   # Preact UI Application
│   │   ├── index.tsx          # Entry point & service initialization
│   │   ├── config/            # Contexts (Config, Theme)
│   │   ├── content/           # Assets & i18n
│   │   ├── external/          # External services
│   │   │   ├── auth/          # Supabase authentication
│   │   │   ├── cms/           # Notion CMS
│   │   │   │   ├── index.ts               # initNotion() + buildHeaders()
│   │   │   │   ├── getAnnouncements.ts    # Fetch announcements by platform
│   │   │   │   ├── getOnboarding.ts       # Fetch onboarding by platform+editor
│   │   │   │   └── checkAnnouncementsVersion.ts # Version check
│   │   │   ├── license/       # License validation
│   │   │   ├── monitoring/    # Sentry
│   │   │   ├── tracking/      # Mixpanel
│   │   │   └── translation/   # Tolgee i18n service
│   │   ├── stores/            # State management (Nanostores atoms)
│   │   │   ├── consent.ts
│   │   │   ├── credits.ts
│   │   │   ├── features.ts
│   │   │   ├── history.ts
│   │   │   └── preferences.ts
│   │   ├── types/             # TypeScript definitions
│   │   │   ├── app.ts
│   │   │   ├── config.ts
│   │   │   ├── events.ts
│   │   │   ├── messages.ts
│   │   │   ├── translations.ts
│   │   │   └── user.ts
│   │   ├── ui/                # Preact components
│   │   │   ├── App.tsx
│   │   │   ├── components/    # Reusable components (HOCs)
│   │   │   ├── contexts/      # Application contexts
│   │   │   ├── modules/       # Feature modules
│   │   │   │   └── modals/    # Modal components
│   │   │   ├── services/      # UI services
│   │   │   ├── stylesheets/   # CSS
│   │   │   └── subcontexts/   # Nested contexts
│   │   └── utils/             # UI utilities
│   │       ├── pluginMessage.ts  # Send messages to Canvas
│   │       └── setContexts.ts
│   ├── utils/                 # Global utilities
│   │   ├── i18n.ts
│   │   └── setData.ts
│   └── global.config.ts       # Global configuration
├── .claude/                    # Claude (VS Code) settings
│   └── settings.json
├── .cursor/                    # Cursor AI configuration
│   ├── mcp.json
│   └── rules/
│       └── project.mdc
├── .eslintrc.json             # ESLint configuration
├── .prettierrc.json           # Prettier configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── package.json               # Dependencies & scripts
└── manifest.json              # Figma plugin manifest
```

## Communication System

### Message Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Component                            │
│              (PureComponent, src/app/ui/)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ sendPluginMessage()
                         │ (src/app/utils/pluginMessage.ts)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       loadUI.ts                                 │
│                  (src/bridges/loadUI.ts)                        │
│                                                                 │
│  figma.ui.onmessage = async (msg) => {                         │
│    const actions = {                                            │
│      ACTION_NAME: async () => { ... },                         │
│    }                                                            │
│    actions[msg.type]()                                          │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Calls bridge functions
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Bridge Functions                             │
│              (src/bridges/checks/, plans/)                      │
│                                                                 │
│  - checkUserConsent()                                           │
│  - createNode()                                                 │
│  - saveToClientStorage()                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Interacts with
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Figma API                                 │
│                                                                 │
│  - figma.createRectangle()                                      │
│  - figma.clientStorage.setAsync()                               │
│  - figma.currentPage.selection                                  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ Response via
                         │ figma.ui.postMessage()
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UI Component                                 │
│         window.addEventListener('message', ...)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Message Flow

#### 1. UI → Canvas

```typescript
// src/app/ui/components/MyComponent.tsx
import { sendPluginMessage } from '../../utils/pluginMessage'

handleAction = () => {
  sendPluginMessage({
    pluginMessage: {
      type: 'CREATE_NODE',
      data: { nodeType: 'RECTANGLE', width: 100, height: 100 }
    }
  })
}
```

#### 2. Canvas Receives and Routes

```typescript
// src/bridges/loadUI.ts
figma.ui.onmessage = async (msg) => {
  const actions: { [key: string]: () => void } = {
    CREATE_NODE: async () => {
      const node = figma.createRectangle()
      node.resize(msg.data.width, msg.data.height)

      figma.ui.postMessage({
        type: 'NODE_CREATED',
        data: { id: node.id, name: node.name }
      })
    }
  }

  if (actions[msg.type]) {
    await actions[msg.type]()
  }
}
```

#### 3. UI Receives Response

```typescript
// src/app/ui/components/MyComponent.tsx
componentDidMount = () => {
  window.addEventListener('message', this.handleMessage)
}

componentWillUnmount = () => {
  window.removeEventListener('message', this.handleMessage)
}

handleMessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage
  if (msg?.type === 'NODE_CREATED') {
    this.setState({ nodeId: msg.data.id })
  }
}
```

## Key Components

### 1. `loadUI.ts` — Message Router

**Location**: `src/bridges/loadUI.ts`

**Responsibilities**:
- Initializes the plugin UI window
- **Centralized router** for all UI → Canvas messages
- Manages window size persistence
- Loads initial data (user, preferences, etc.)

**Pattern**:
```typescript
const loadUI = async () => {
  figma.showUI(__html__, { width, height, title, themeColors: true })

  figma.ui.onmessage = async (msg) => {
    const actions = {
      LOAD_DATA: async () => { /* ... */ },
      CREATE_NODE: async () => { /* ... */ },
      SAVE_PREFERENCES: async () => { /* ... */ },
    }

    if (actions[msg.type]) {
      await actions[msg.type]()
    }
  }
}
```

### 2. `pluginMessage.ts` — Message Sender

**Location**: `src/app/utils/pluginMessage.ts`

**Responsibilities**:
- **Centralized service** for sending messages from UI to Canvas
- Abstraction layer over `parent.postMessage()`

```typescript
sendPluginMessage({
  pluginMessage: {
    type: 'ACTION_NAME',
    data: { /* payload */ }
  }
})
```

Always use `sendPluginMessage()` from UI components — never call `parent.postMessage()` directly.

## Directory Organization

### `/src/bridges/` — Canvas Logic

| Directory/File | Description |
|----------------|-------------|
| `loadUI.ts` | Main message router |
| `checks/` | Validation functions (consent, license, credits, trial, editor, announcements, preferences) |
| `plans/` | Subscription management (enableTrial, payProPlan) |

**Rules**:
- Figma API interaction only
- Async/await functions with try/catch
- No Preact code, no DOM manipulation

### `/src/app/external/cms/` — Notion CMS

The CMS layer uses a module-scope singleton initialized once at startup:

| File | Description |
|------|-------------|
| `index.ts` | `initNotion(apiKey)` + `buildHeaders()` — state only, no re-exports |
| `getAnnouncements.ts` | Fetch announcements filtered by `Platform` |
| `getOnboarding.ts` | Fetch onboarding steps filtered by `Platform` + `Editor` |
| `checkAnnouncementsVersion.ts` | Fetch the latest announcement version string |

```typescript
// index.ts
let notionApiKey: string | null = null
export const initNotion = (apiKey: string) => { notionApiKey = apiKey }
export const buildHeaders = (): HeadersInit =>
  notionApiKey ? { Authorization: notionApiKey } : {}

// index.tsx (app entry)
if (globalConfig.env.isNotionEnabled && notionApiKey !== undefined)
  initNotion(notionApiKey)
```

> ⚠️ `VITE_NOTION_API_KEY` is for local development only. In production the key lives as a Cloudflare Worker secret.

### `/src/app/stores/` — State Management (Nanostores)

State is managed via **Nanostores atoms** (`atom` from `nanostores`), not Zustand. Atoms are prefixed with `$` and subscribed to in components via `@nanostores/preact`.

| File | Description |
|------|-------------|
| `consent.ts` | User consent state |
| `credits.ts` | Credits count atom (`$creditsCount`) |
| `features.ts` | Feature flags state |
| `history.ts` | Action history state |
| `preferences.ts` | User preferences state |

```typescript
import { atom } from 'nanostores'
export const $creditsCount = atom<number>(0)

// In component
import { useStore } from '@nanostores/preact'
const credits = useStore($creditsCount)
```

### `/src/app/` — UI Application

**Rules**:
- **PureComponent class** pattern with HOCs (`WithConfig`, `WithTranslation`)
- Use `sendPluginMessage()` to communicate with Canvas
- Strict TypeScript — no `any`
- Use `@unoff/ui` and `@unoff/utils`
- No direct Figma API calls, no `parent.postMessage()` directly
- Never recreate components that already exist in `@unoff/ui`

### UI Component Libraries

#### `@unoff/ui`

Pre-built UI components for Figma plugins. Full API at [ui.unoff.dev](https://ui.unoff.dev/).

**Available components**:
- **Layout**: Bar, Layout, Section, SectionTitle, SimpleItem, List, Card
- **Forms**: Button, Input, Dropdown, FormItem, SimpleSlider
- **Feedback**: Dialog, SemanticMessage, Notification, Consent
- **Navigation**: Tabs, Menu
- **Display**: Icon, Tooltip, Chip, IconChip, Feature

**CSS utilities**: `layouts` (layout classes), `texts` (typography classes)

```typescript
import { Bar, Button, layouts, texts } from '@unoff/ui'
import { doClassnames, FeatureStatus } from '@unoff/utils'

class MyPanel extends React.PureComponent<Props, State> {
  static features = (planStatus, config, service, editor) => ({
    MY_FEATURE: new FeatureStatus({
      features: config.features,
      featureName: 'MY_FEATURE',
      planStatus, currentService: service, currentEditor: editor,
    }),
  })

  render() {
    const features = MyPanel.features(/* ... */)
    return (
      <Button
        type="primary"
        label="Action"
        feature="MY_FEATURE"
        isBlocked={features.MY_FEATURE.isBlocked()}
        action={this.handleAction}
      />
    )
  }
}
```

#### `@unoff/utils`

```typescript
import { doClassnames, FeatureStatus } from '@unoff/utils'

const feature = new FeatureStatus({ features, featureName: 'CREATE_SHAPES', planStatus, currentService: service, currentEditor: editor })
feature.isActive()   // enabled?
feature.isBlocked()  // needs upgrade?
feature.isNew()      // show "new" badge?

const className = doClassnames([layouts['snackbar--medium'], texts['type'], isActive && 'active'])
```

### `/src/utils/` — Global Utilities

| File | Description |
|------|-------------|
| `i18n.ts` | `createI18n()` for Canvas-side translations (ICU format) |
| `setData.ts` | Data management helpers |

## Configuration and Code Quality

### Project Root

| File | Purpose |
|------|---------|
| `.eslintrc.json` | ESLint rules |
| `.prettierrc.json` | Prettier configuration |
| `tsconfig.json` | TypeScript strict mode |
| `vite.config.ts` | Dual Vite build (IIFE Canvas + single-file UI) |
| `.cursor/rules/project.mdc` | Cursor AI guidelines |
| `.cursor/mcp.json` | MCP servers (Figma remote + desktop) |
| `.windsurf/rules/project.md` | Windsurf AI guidelines |
| `.windsurf/mcp.json` | MCP servers (Figma remote + desktop) |
| `.claude/settings.json` | Claude (VS Code) guidelines |
| `.github/copilot-instructions.md` | GitHub Copilot guidelines |
| `.vscode/mcp.json` | MCP servers (Figma remote + desktop) |

### Available Scripts

```json
{
  "start:dev":           "Development build with hot reload",
  "build:prod":          "Production build",
  "typecheck":           "TypeScript type checking",
  "lint":                "ESLint check and auto-fix",
  "format":              "Format with Prettier",
  "start:announcements": "Start announcement worker (port 8888) — added by unoff add announcement-worker",
  "start:token":         "Start auth worker (port 8787) — added by unoff add auth-worker",
  "start:cors":          "Start CORS worker (port 8989) — added by unoff add cors-worker"
}
```

Worker scripts are injected automatically by `unoff add <worker>`.

## Integrated External Services

{{#isSupabaseEnabled}}
### Supabase
- **Location**: `src/app/external/auth/`
- **Usage**: Authentication and database
- **Environment variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLIC_ANON_KEY`
{{/isSupabaseEnabled}}

{{#isSentryEnabled}}
### Sentry
- **Location**: `src/app/external/monitoring/`
- **Usage**: Error monitoring with session replay
- **Environment variables**: `VITE_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (`.env.sentry-build-plugin`)
{{/isSentryEnabled}}

{{#isMixpanelEnabled}}
### Mixpanel
- **Location**: `src/app/external/tracking/`
- **Usage**: Analytics (EU endpoint, cookie-less)
- **Environment variables**: `VITE_MIXPANEL_TOKEN`
{{/isMixpanelEnabled}}

### Notion
- **Location**: `src/app/external/cms/`
- **Usage**: Announcements and onboarding content
- **Environment variables**: `VITE_ANNOUNCEMENTS_WORKER_URL`, `VITE_NOTION_ANNOUNCEMENTS_ID`, `VITE_NOTION_ONBOARDING_ID`, `VITE_NOTION_API_KEY` (local dev only)
- **Production**: API key stored as a Cloudflare Worker secret (`wrangler secret put NOTION_API_KEY`)

## Best Practices

### Communication
1. Always use `sendPluginMessage()` from UI components
2. Always route messages through `loadUI.ts`
3. Use the `actions` map pattern for handlers
4. Send responses back with `figma.ui.postMessage()`

### TypeScript
1. Strict mode enabled — no `any` (use `unknown` if necessary)
2. Prefer `interface` for objects, `type` for unions/intersections
3. Keep types in `src/app/types/`

### Preact/React
1. **PureComponent class** pattern (not functional components)
2. HOCs: `WithConfig` then `WithTranslation` (order matters)
3. Static `features` method for `FeatureStatus` checks
4. One component per file

### State Management
1. Nanostores `atom` for shared state (prefix with `$`)
2. `useStore()` from `@nanostores/preact` in components
3. `figma.clientStorage` for persistent user preferences (synced via bridge)

### Organization
1. Strict Canvas / UI separation — never mix them
2. One file per responsibility
3. Name bridge files with verbs, components with nouns

## Development Workflow

### Adding a New Feature

1. **Define types** (`src/app/types/`)
2. **Create bridge logic** (`src/bridges/`)
3. **Add action in `loadUI.ts`**
4. **Create UI components** (`src/app/ui/`)
5. **Wire communication** (`sendPluginMessage` + `componentDidMount` listener)
6. **Add to store if needed** (`src/app/stores/`)
7. **Add translations** (`src/app/content/translations/`)

### Adding a Worker

```bash
# Add a Cloudflare Worker as a git submodule
unoff add announcement-worker

# Install workspace dependencies
npm install

# Start the worker locally
npm run start:announcements
```

### Useful Commands

```bash
# Development
unoff dev           # or: npm run start:dev

# Production build
unoff build         # or: npm run build:prod

# Code quality
unoff check         # lint + typecheck
unoff format        # Prettier

# Workers
unoff add <worker>      # Add a worker submodule
unoff remove <worker>   # Remove a worker submodule
```

## Resources

- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Preact Documentation](https://preactjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [unoff-ui Storybook](https://ui.unoff.dev/)
- [Nanostores](https://github.com/nanostores/nanostores)
- [Tolgee](https://tolgee.io/)

---

**Note**: This document is automatically generated when creating a plugin with `unoff create figma-plugin`.
