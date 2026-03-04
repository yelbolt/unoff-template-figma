import { createI18n } from './utils/i18n'
import globalConfig from './global.config'
import loadUI from './bridges/loadUI'
import checkTrialStatus from './bridges/checks/checkTrialStatus'
import fr_FR from './app/content/translations/fr-FR.json'
import en_US from './app/content/translations/en-US.json'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Martian Mono', style: 'Medium' })
figma.loadFontAsync({ family: 'Lexend', style: 'Medium' })

// Locales
export let tolgee: ReturnType<typeof createI18n>

// Loader
figma.on('run', async () => {
  // Load locales on Canvas side
  tolgee = createI18n(
    {
      'fr-FR': fr_FR,
      'en-US': en_US,
    },
    globalConfig.lang
  )

  // Check trial status on selection change
  figma.on('selectionchange', async () => await checkTrialStatus())

  // Load UI side
  loadUI()
})
