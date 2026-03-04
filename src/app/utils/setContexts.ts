import { Feature, FeatureStatus } from '@unoff/utils'
import { Context, Editor, PlanStatus, Service } from '../types/app'

export const setContexts = (
  contextList: Array<Context>,
  planStatus: PlanStatus,
  features: Array<Feature<'MY_SERVICE'>>,
  editor: Editor,
  service: Service,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locales: (key: string, params?: Record<string, any> | undefined) => string
) => {
  const featuresList = {
    MY_FIRST_CONTEXT: new FeatureStatus({
      features: features,
      featureName: 'MY_FIRST_CONTEXT',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
    MY_SECOND_CONTEXT: new FeatureStatus({
      features: features,
      featureName: 'MY_SECOND_CONTEXT',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
    MY_THIRD_CONTEXT: new FeatureStatus({
      features: features,
      featureName: 'MY_THIRD_CONTEXT',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
    MY_FIRST_CONTEXT_SUBCONTEXT_A: new FeatureStatus({
      features: features,
      featureName: 'MY_FIRST_CONTEXT_SUBCONTEXT_A',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
    MY_FIRST_CONTEXT_SUBCONTEXT_B: new FeatureStatus({
      features: features,
      featureName: 'MY_FIRST_CONTEXT_SUBCONTEXT_B',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
    MY_FIRST_CONTEXT_SUBCONTEXT_C: new FeatureStatus({
      features: features,
      featureName: 'MY_FIRST_CONTEXT_SUBCONTEXT_C',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
  }

  const contexts: Array<{
    label: string
    id: Context
    isUpdated: boolean
    isNew: boolean
    isActive: boolean
  }> = [
    {
      label: locales('myService.contexts.firstContext'),
      id: 'MY_FIRST_CONTEXT',
      isUpdated: false,
      isNew: featuresList.MY_FIRST_CONTEXT.isNew(),
      isActive: featuresList.MY_FIRST_CONTEXT.isActive(),
    },
    {
      label: locales('myService.contexts.secondContext'),
      id: 'MY_SECOND_CONTEXT',
      isUpdated: false,
      isNew: featuresList.MY_SECOND_CONTEXT.isNew(),
      isActive: featuresList.MY_SECOND_CONTEXT.isActive(),
    },
    {
      label: locales('myService.contexts.thirdContext'),
      id: 'MY_THIRD_CONTEXT',
      isUpdated: false,
      isNew: featuresList.MY_THIRD_CONTEXT.isNew(),
      isActive: featuresList.MY_THIRD_CONTEXT.isActive(),
    },
    {
      label: locales('myService.subcontexts.firstContextSubcontextA'),
      id: 'MY_FIRST_CONTEXT_SUBCONTEXT_A',
      isUpdated: false,
      isNew: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_A.isNew(),
      isActive: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_A.isActive(),
    },
    {
      label: locales('myService.subcontexts.firstContextSubcontextB'),
      id: 'MY_FIRST_CONTEXT_SUBCONTEXT_B',
      isUpdated: false,
      isNew: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_B.isNew(),
      isActive: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_B.isActive(),
    },
    {
      label: locales('myService.subcontexts.firstContextSubcontextC'),
      id: 'MY_FIRST_CONTEXT_SUBCONTEXT_C',
      isUpdated: false,
      isNew: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_C.isNew(),
      isActive: featuresList.MY_FIRST_CONTEXT_SUBCONTEXT_C.isActive(),
    },
    // Add more contexts as needed
  ]

  const filteredContexts = contexts.filter((context) => {
    return contextList.includes(context.id) && context.isActive
  })

  return filteredContexts.sort((a, b) => {
    return contextList.indexOf(a.id) - contextList.indexOf(b.id)
  })
}
