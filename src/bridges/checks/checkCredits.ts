import globalConfig from '../../global.config'

const addHours = (date: Date, hours: number) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

// Reads and resolves the current credits state. Handles 4 cases:
// 1. No renew date stored → initialize
// 2. Renew period elapsed → refill and advance date
// 3. Count is NaN (first ever use) → initialize to limit
// 4. Credits version mismatch → reset count and advance date
const checkCredits = async () => {
  // ── Storage reads ─────────────────────────────────────────────────────
  const creditsCountStr = await figma.clientStorage.getAsync('credits_count')
  const renewDateStr = await figma.clientStorage.getAsync('credits_renew_date')
  const creditsVersion = await figma.clientStorage.getAsync('credits_version')

  const now = new Date()
  const periodHours =
    globalConfig.plan.creditsRenewalPeriodHours ??
    globalConfig.plan.creditsRenewalPeriodDays * 24

  let creditsCount =
    creditsCountStr !== null ? parseFloat(creditsCountStr) : NaN
  let renewDate: Date | null =
    renewDateStr !== null && !Number.isNaN(parseInt(renewDateStr, 10))
      ? new Date(parseInt(renewDateStr, 10))
      : null

  // ── Case 1: No renew date → initialize ────────────────────────────────
  if (renewDate === null) {
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync('credits_renew_date', next.getTime().toString())
    renewDate = next
  }

  // ── Case 2: Period elapsed → refill ───────────────────────────────────
  if (renewDate && renewDate.getTime() <= now.getTime()) {
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync('credits_renew_date', next.getTime().toString())
    creditsCount = globalConfig.plan.creditsLimit
  }

  // ── Case 3: NaN count → initialize ────────────────────────────────────
  if (Number.isNaN(creditsCount)) {
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    creditsCount = globalConfig.plan.creditsLimit
  }

  // ── Case 4: Version mismatch → reset ──────────────────────────────────
  if (creditsVersion !== globalConfig.versions.creditsVersion) {
    figma.clientStorage.setAsync(
      'credits_version',
      globalConfig.versions.creditsVersion
    )
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync('credits_renew_date', next.getTime().toString())
    creditsCount = globalConfig.plan.creditsLimit
    renewDate = next
  }

  // ── Send result to UI ──────────────────────────────────────────────────
  figma.ui.postMessage({
    type: 'CHECK_CREDITS',
    data: {
      creditsCount: creditsCount,
      creditsRenewalDate: renewDate?.getTime() ?? null,
    },
  })

  return creditsCount
}

export default checkCredits
