import globalConfig from '../../global.config'
import { tolgee } from '../..'

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
