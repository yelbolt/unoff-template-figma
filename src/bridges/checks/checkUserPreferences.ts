import globalConfig from '../../global.config'
import { tolgee } from '../..'

// Reads stored user preferences (language, suggested-language flag), fills
// missing values with defaults, syncs Tolgee, and sends them to the UI.
// This is the last step in the LOAD_DATA chain — sets isLoaded: true in the UI.
const checkUserPreferences = async () => {
  // Example preferences: user_language
  let userLanguage = await figma.clientStorage.getAsync('user_language')
  let isSuggestedLanguageDisplayed = await figma.clientStorage.getAsync(
    'is_suggested_language_displayed'
  )

  // Fill if preferences are missing
  if (userLanguage === undefined) {
    await figma.clientStorage.setAsync('user_language', globalConfig.lang)
    userLanguage = globalConfig.lang
  }

  if (isSuggestedLanguageDisplayed === undefined) {
    await figma.clientStorage.setAsync('is_suggested_language_displayed', true)
    isSuggestedLanguageDisplayed = true
  }

  // Update current language with Tolgee
  tolgee.changeLanguage(userLanguage)

  return figma.ui.postMessage({
    type: 'CHECK_USER_PREFERENCES',
    data: {
      userLanguage: userLanguage,
      isSuggestedLanguageDisplayed: isSuggestedLanguageDisplayed,
    },
  })
}

export default checkUserPreferences
