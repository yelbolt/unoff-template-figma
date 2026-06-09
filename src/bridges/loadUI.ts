import globalConfig from '../global.config'
import TodoChecklist from '../canvas/TodoChecklist'
import ColorPalette from '../canvas/ColorPalette'
import { tolgee } from '..'
import payProPlan from './plans/payProPlan'
import enableTrial from './plans/enableTrial'
import checkUserPreferences from './checks/checkUserPreferences'
import checkUserLicense from './checks/checkUserLicense'
import checkUserConsent from './checks/checkUserConsent'
import checkTrialStatus from './checks/checkTrialStatus'
import checkEditor from './checks/checkEditor'
import checkCredits from './checks/checkCredits'
import checkAnnouncementsStatus from './checks/checkAnnouncementsStatus'

interface Window {
  width: number
  height: number
}

const loadUI = async () => {
  // Get window size from storage
  const windowSize: Window = {
    width:
      (await figma.clientStorage.getAsync('plugin_window_width')) ??
      globalConfig.limits.width,
    height:
      (await figma.clientStorage.getAsync('plugin_window_height')) ??
      globalConfig.limits.height,
  }

  // Setup UI
  figma.showUI(__html__, {
    width: windowSize.width,
    height: windowSize.height,
    title: '{{ pluginName }}',
    themeColors: true,
  })

  // Listen to messages from UI to Canvas
  figma.ui.onmessage = async (msg) => {
    const path = msg

    const actions: { [key: string]: () => void } = {
      // ── Startup ──────────────────────────────────────────────────────
      LOAD_DATA: async () => {
        figma.ui.postMessage({
          type: 'CHECK_USER_AUTHENTICATION',
          data: {
            id: figma.currentUser?.id,
            fullName: figma.currentUser?.name,
            avatar: figma.currentUser?.photoUrl,
            accessToken: await figma.clientStorage.getAsync(
              'supabase_access_token'
            ),
            refreshToken: await figma.clientStorage.getAsync(
              'supabase_refresh_token'
            ),
          },
        })
        figma.ui.postMessage({
          type: 'CHECK_ANNOUNCEMENTS_VERSION',
        })

        checkUserConsent(path.data.userConsent)
          .then(() => checkEditor())
          .then(() => checkTrialStatus())
          .then(() => checkCredits())
          .then(() => checkUserLicense())
          .then(() => checkUserPreferences())
      },

      // ── Announcements ─────────────────────────────────────────────────
      CHECK_ANNOUNCEMENTS_STATUS: () =>
        checkAnnouncementsStatus(path.data.version),

      // ── Preferences ───────────────────────────────────────────────────
      RESIZE_UI: async () => {
        await figma.clientStorage.setAsync(
          'plugin_window_width',
          path.data.width
        )
        await figma.clientStorage.setAsync(
          'plugin_window_height',
          path.data.height
        )

        figma.ui.resize(path.data.width, path.data.height)
      },
      UPDATE_LANGUAGE: async () => {
        await figma.clientStorage.setAsync('user_language', path.data.lang)
        tolgee.changeLanguage(path.data.lang)
      },

      // ── Storage ───────────────────────────────────────────────────────
      SET_ITEMS: () => {
        path.items.forEach(async (item: { key: string; value: unknown }) => {
          if (typeof item.value === 'object')
            figma.clientStorage.setAsync(item.key, JSON.stringify(item.value))
          else if (item.value === 'true' || item.value === 'false')
            figma.clientStorage.setAsync(item.key, item.value === 'true')
          else figma.clientStorage.setAsync(item.key, item.value as string)
        })
      },
      GET_ITEMS: async () =>
        path.items.map(async (item: string) => {
          const value = await figma.clientStorage.getAsync(item)
          if (value && typeof value === 'string')
            figma.ui.postMessage({
              type: `GET_ITEM_${item.toUpperCase()}`,
              data: {
                value: value,
              },
            })
        }),
      DELETE_ITEMS: () =>
        path.items.forEach(async (item: string) =>
          figma.clientStorage.setAsync(item, '')
        ),

      // ── Canvas ────────────────────────────────────────────────────────
      GENERATE_TODO_ON_CANVAS: async () => {
        await figma.loadFontAsync({ family: 'Lexend', style: 'Medium' })
        const checklist = new TodoChecklist({ items: path.data.items })
        figma.currentPage.appendChild(checklist.node)
        figma.viewport.scrollAndZoomIntoView([checklist.node])
      },
      GENERATE_COLOR_PALETTE: async () => {
        await figma.loadFontAsync({ family: 'Martian Mono', style: 'Medium' })
        const palette = new ColorPalette({ baseColor: path.data.baseColor })
        figma.currentPage.appendChild(palette.node)
        figma.viewport.scrollAndZoomIntoView([palette.node])
      },
      GET_SELECTION: () => sendSelectionInfo(),

      // ── Browser ───────────────────────────────────────────────────────
      OPEN_IN_BROWSER: () => figma.openExternal(path.data.url),
      POST_MESSAGE: () => {
        figma.ui.postMessage({
          type: 'POST_MESSAGE',
          data: {
            type: path.data.type,
            message: path.data.message,
          },
        })
      },

      // ── Plans ─────────────────────────────────────────────────────────
      ENABLE_TRIAL: async () => {
        enableTrial(path.data.trialTime, path.data.trialVersion).then(() =>
          checkTrialStatus()
        )
      },
      GET_TRIAL: async () =>
        figma.ui.postMessage({
          type: 'GET_TRIAL',
        }),
      GET_PRO: async () =>
        figma.ui.postMessage({
          type: 'GET_PRICING',
          data: {
            // Add the templates you need from the component Pricing.tsx
            plans: ['PLAN_A', 'PLAN_B', 'ACTIVATE'],
          },
        }),
      GET_LICENSE: async () =>
        figma.ui.postMessage({
          type: 'GET_LICENSE',
        }),
      GO_TO_PLAN_A: async () => payProPlan(),
      GO_TO_PLAN_B: async () => figma.openExternal(globalConfig.urls.storeUrl),
      ENABLE_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'ENABLE_PRO_PLAN',
        }),
      LEAVE_PRO_PLAN: async () => {
        figma.ui.postMessage({
          type: 'LEAVE_PRO_PLAN',
        })
        checkTrialStatus()
      },
      WELCOME_TO_PRO: async () =>
        figma.ui.postMessage({
          type: 'WELCOME_TO_PRO',
        }),

      // ── Auth ──────────────────────────────────────────────────────────
      SIGN_OUT: () =>
        figma.ui.postMessage({
          type: 'SIGN_OUT',
          data: {
            connectionStatus: 'UNCONNECTED',
            fullName: '',
            avatar: '',
            id: undefined,
          },
        }),

      DEFAULT: () => null,
    }

    try {
      return actions[path.type]?.()
    } catch {
      return actions['DEFAULT']?.()
    }
  }

  // ── Listeners ─────────────────────────────────────────────────────────────
  figma.on('selectionchange', () => sendSelectionInfo())
}

// ── Selection helper ─────────────────────────────────────────────────────────

const sendSelectionInfo = () => {
  const selection = figma.currentPage.selection
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'SET_SELECTION_INFO', data: null })
    return
  }
  const node = selection[0]
  const fills = (node as SceneNode & { fills?: readonly Paint[] }).fills
  let fill: string | undefined
  if (fills && fills.length > 0 && fills[0].type === 'SOLID') {
    const { r, g, b } = fills[0].color
    fill = [r, g, b]
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
    fill = `#${fill}`
  }
  figma.ui.postMessage({
    type: 'SET_SELECTION_INFO',
    data: {
      name: node.name,
      type: node.type,
      width: Math.round(
        (node as SceneNode & { width: number }).width ?? 0
      ),
      height: Math.round(
        (node as SceneNode & { height: number }).height ?? 0
      ),
      x: Math.round((node as SceneNode & { x: number }).x ?? 0),
      y: Math.round((node as SceneNode & { y: number }).y ?? 0),
      fill,
      opacity: Math.round(
        ((node as SceneNode & { opacity?: number }).opacity ?? 1) * 100
      ),
    },
  })
}

export default loadUI
