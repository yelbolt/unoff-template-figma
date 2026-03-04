import React from 'react'
import { PureComponent } from 'preact/compat'
import { FeatureStatus } from '@unoff/utils'
import { Layout } from '@unoff/ui'
import { WithTranslationProps } from '../components/WithTranslation'
import { WithConfigProps } from '../components/WithConfig'
import { BaseProps, Editor, PlanStatus, Service } from '../../types/app'
import { ConfigContextType } from '../../config/ConfigContext'

interface MyThirdContextProps
  extends BaseProps, WithConfigProps, WithTranslationProps {}

interface MyThirdContextState {
  myState: boolean
}

export default class MyThirdContext extends PureComponent<
  MyThirdContextProps,
  MyThirdContextState
> {
  static features = (
    planStatus: PlanStatus,
    config: ConfigContextType,
    service: Service,
    editor: Editor
  ) => ({
    MY_FEATURE: new FeatureStatus({
      features: config.features,
      featureName: 'MY_FEATURE',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
  })

  private get features() {
    return MyThirdContext.features(
      this.props.planStatus,
      this.props.config,
      this.props.service,
      this.props.editor
    )
  }

  constructor(props: MyThirdContextProps) {
    super(props)
    this.state = {
      myState: false,
    }
  }

  // Render
  render() {
    return (
      <>
        <Layout
          id="my-third-context"
          column={[
            {
              node: <div></div>,
              typeModifier: 'BLANK',
            },
          ]}
          isFullHeight
          isFullWidth
        />
      </>
    )
  }
}
