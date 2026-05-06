// Triggers the Figma native checkout overlay (interstitial: 'SKIP' = go straight
// to checkout). On success, notifies the UI with WELCOME_TO_PRO.
const payProPlan = async () => {
  await figma.payments
    ?.initiateCheckoutAsync({
      interstitial: 'SKIP',
    })
    .then(() => {
      if (figma.payments?.status.type === 'PAID')
        figma.ui.postMessage({
          type: 'WELCOME_TO_PRO',
          data: {
            status: figma.payments.status.type,
            id: figma.currentUser?.id,
          },
        })
    })
}

export default payProPlan
