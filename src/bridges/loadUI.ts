import globalConfig from '../global.config'
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
      //
      CHECK_ANNOUNCEMENTS_STATUS: () =>
        checkAnnouncementsStatus(path.data.version),
      //
      UPDATE_LANGUAGE: async () => {
        await figma.clientStorage.setAsync('user_language', path.data.lang)
        tolgee.changeLanguage(path.data.lang)
      },
      //
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
      //
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
      //
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
      //
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
      //
      DEFAULT: () => null,
    }

    try {
      return actions[path.type]?.()
    } catch {
      return actions['DEFAULT']?.()
    }
  }
}

export default loadUI
