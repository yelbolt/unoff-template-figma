import React from 'react'
import { PureComponent } from 'preact/compat'
import { FeatureStatus } from '@unoff/utils'
import { Layout } from '@unoff/ui'
import { WithTranslationProps } from '../components/WithTranslation'
import { WithConfigProps } from '../components/WithConfig'
import { BaseProps, Editor, PlanStatus, Service } from '../../types/app'
import { ConfigContextType } from '../../config/ConfigContext'

interface MySubcontextBProps
  extends BaseProps, WithConfigProps, WithTranslationProps {
  //
}

interface MySubcontextBState {
  myState: boolean
}

export default class MySubcontextB extends PureComponent<
  MySubcontextBProps,
  MySubcontextBState
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
    return MySubcontextB.features(
      this.props.planStatus,
      this.props.config,
      this.props.service,
      this.props.editor
    )
  }

  constructor(props: MySubcontextBProps) {
    super(props)
    this.state = {
      myState: false,
    }
  }

  // Render
  render() {
    return (
      <Layout
        id="my-subcontext-a"
        column={[
          {
            node: <div></div>,
            typeModifier: 'BLANK',
          },
        ]}
        isFullHeight
        isFullWidth
      />
    )
  }
}
