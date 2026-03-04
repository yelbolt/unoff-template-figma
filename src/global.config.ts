import { Feature } from '@unoff/utils'
import { Config } from './app/types/config'
import { doSpecificMode } from './app/stores/features'

declare const __APP_VERSION__: string

const isDev = import.meta.env.MODE === 'development'

const globalConfig: Config = {
  limits: {
    pageSize: 20,
    width: 640,
    height: 640,
    minWidth: 240,
    minHeight: 420,
  },
  env: {
    platform: 'figma',
    editor: 'figma',
    ui: 'figma',
    colorMode: 'figma-dark',
    isDev,
    isSupabaseEnabled: true,
    isMixpanelEnabled: true,
    isSentryEnabled: true,
    isNotionEnabled: true,
    announcementsDbId: import.meta.env.VITE_NOTION_ANNOUNCEMENTS_ID as string,
    onboardingDbId: import.meta.env.VITE_NOTION_ONBOARDING_ID as string,
    pluginId: '{{ pluginId }}',
  },
  information: {
    pluginName: '{{ pluginName }}',
    authorName: '{{ authorName }}',
    licenseName: '{{ licenseName }}',
    repositoryName: '{{ pluginSlug }}',
  },
  plan: {
    isProEnabled: true,
    isTrialEnabled: false,
    isCreditsEnabled: false,
    trialTime: 72,
    creditsLimit: 250,
    creditsRenewalPeriodDays: 1,
    creditsRenewalPeriodHours: 24,
  },
  dbs: {
    dbViewName: 'table_view_name',
  },
  urls: {
    authWorkerUrl: import.meta.env.VITE_AUTH_WORKER_URL as string,
    announcementsWorkerUrl: import.meta.env.VITE_ANNOUNCEMENTS_WORKER_URL as string,
    corsWorkerUrl: import.meta.env.VITE_CORS_WORKER_URL as string,
    databaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    authUrl: import.meta.env.VITE_AUTH_URL as string,
    storeApiUrl: import.meta.env.VITE_LEMONSQUEEZY_URL as string,
    platformUrl: 'https://www.figma.com',
    uiUrl: isDev ? 'http://localhost:4400' : 'https://ui.{{ pluginSlug }}.com',
    documentationUrl: 'https://docs.{{ pluginSlug }}.com',
    repositoryUrl: 'https://git.{{ pluginSlug }}.com/{{ pluginSlug }}-repo',
    communityUrl: 'https://community.{{ pluginSlug }}.com',
    supportEmail: 'https://support.{{ pluginSlug }}.com',
    feedbackUrl: 'https://feedback.{{ pluginSlug }}.com',
    trialFeedbackUrl: 'https://feedback.{{ pluginSlug }}.com/trial',
    requestsUrl: 'https://ideas.{{ pluginSlug }}.com',
    networkUrl: 'https://social.{{ pluginSlug }}.com',
    authorUrl: 'https://{{ pluginSlug }}.com/author',
    licenseUrl: 'https://{{ pluginSlug }}.com/license',
    privacyUrl: 'https://{{ pluginSlug }}.com/privacy',
    storeUrl: 'https://{{ pluginSlug }}.com/store',
    storeManagementUrl: 'https://{{ pluginSlug }}.com/store-management',
  },
  versions: {
    userConsentVersion: '2025.09',
    trialVersion: '2024.03',
    pluginVersion: __APP_VERSION__,
    creditsVersion: '2025.12',
  },
  features: doSpecificMode([
    // Desactivated features
  ], [
    // Pro features
    'ADD_ITEM',
  ], [
    // New features
    'MY_FIRST_CONTEXT_SUBCONTEXT_C',
  ]),
  lang: 'en-US',
  fees: {
    myFee: 50,
  },
}

const limitsMapping: { [key: string]: keyof typeof globalConfig.limits } = {
  //
}

globalConfig.features.forEach((feature: Feature<'MY_SERVICE'>) => {
  const limitKey = limitsMapping[feature.name]
  if (limitKey && globalConfig.limits[limitKey] !== undefined)
    feature.limit = globalConfig.limits[limitKey]
})

export default globalConfig
