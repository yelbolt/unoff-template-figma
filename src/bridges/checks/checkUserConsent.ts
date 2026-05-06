import { ConsentConfiguration } from '@unoff/ui'
import globalConfig from '../../global.config'

// Reads stored consent flags and checks if the user must re-consent
// (first time or consent version changed).
const checkUserConsent = async (userConsent: Array<ConsentConfiguration>) => {
  // ── Storage reads ─────────────────────────────────────────────────────
  const currentUserConsentVersion = await figma.clientStorage.getAsync(
    'user_consent_version'
  )

  const userConsentData = await Promise.all(
    userConsent.map(async (consent) => {
      return {
        ...consent,
        isConsented: await figma.clientStorage.getAsync(
          `${consent.id}_user_consent`
        ),
      }
    })
  )

  // ── Send result to UI ──────────────────────────────────────────────────
  return figma.ui.postMessage({
    type: 'CHECK_USER_CONSENT',
    data: {
      mustUserConsent:
        currentUserConsentVersion !==
          globalConfig.versions.userConsentVersion ||
        currentUserConsentVersion === undefined,
      userConsent: userConsentData,
    },
  })
}

export default checkUserConsent
