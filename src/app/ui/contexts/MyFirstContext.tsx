import React from 'react'
import { PureComponent } from 'preact/compat'
import { FeatureStatus } from '@unoff/utils'
import { Layout, Tabs } from '@unoff/ui'
import MySubcontextC from '../subcontexts/MySubcontextC'
import MySubcontextB from '../subcontexts/MySubcontextB'
import MySubcontextA from '../subcontexts/MySubcontextA'
import { WithTranslationProps } from '../components/WithTranslation'
import { WithConfigProps } from '../components/WithConfig'
import { setContexts } from '../../utils/setContexts'
import {
  BaseProps,
  Context,
  ContextItem,
  Editor,
  PlanStatus,
  Service,
} from '../../types/app'
import { ConfigContextType } from '../../config/ConfigContext'

interface MyFirstContextProps
  extends BaseProps, WithConfigProps, WithTranslationProps {}

interface MyFirstContextState {
  context: Context | ''
}

export default class MyFirstContext extends PureComponent<
  MyFirstContextProps,
  MyFirstContextState
> {
  private contexts: Array<ContextItem>
  private theme: string | null

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
    return MyFirstContext.features(
      this.props.planStatus,
      this.props.config,
      this.props.service,
      this.props.editor
    )
  }

  constructor(props: MyFirstContextProps) {
    super(props)
    this.contexts = setContexts(
      [
        'MY_FIRST_CONTEXT_SUBCONTEXT_A',
        'MY_FIRST_CONTEXT_SUBCONTEXT_B',
        'MY_FIRST_CONTEXT_SUBCONTEXT_C',
      ],
      props.planStatus,
      props.config.features,
      props.editor,
      props.service,
      props.t
    )
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
    }
    this.theme = document.documentElement.getAttribute('data-theme')
  }

  // Lifecycle
  componentDidUpdate(previousProps: Readonly<MyFirstContextProps>): void {
    if (previousProps.t !== this.props.t) {
      this.contexts = setContexts(
        [
          'MY_FIRST_CONTEXT_SUBCONTEXT_A',
          'MY_FIRST_CONTEXT_SUBCONTEXT_B',
          'MY_FIRST_CONTEXT_SUBCONTEXT_C',
        ],
        this.props.planStatus,
        this.props.config.features,
        this.props.editor,
        this.props.service,
        this.props.t
      )

      this.forceUpdate()
    }
  }

  // Handlers
  navHandler = (e: Event) =>
    this.setState({
      context: (e.currentTarget as HTMLElement).dataset.feature as Context,
    })

  // Render
  render() {
    let fragment
    let isFlex = true
    let padding

    switch (this.theme) {
      case 'figma':
        isFlex = false
        padding = 'var(--size-null) var(--size-pos-xsmall)'
        break
      case 'penpot':
        isFlex = true
        padding = 'var(--size-null) var(--size-pos-xsmall)'
        break
      case 'sketch':
        isFlex = false
        padding = 'var(--size-null) var(--size-pos-xsmall)'
        break
      case 'framer':
        isFlex = true
        padding = 'var(--size-null) var(--size-pos-xsmall)'
        break
      default:
        isFlex = true
        padding = 'var(--size-null) var(--size-pos-xsmall)'
    }

    if (this.props.documentWidth > 460) padding = 'var(--size-null)'

    switch (this.state.context) {
      case 'MY_FIRST_CONTEXT_SUBCONTEXT_A': {
        fragment = <MySubcontextA {...this.props} />
        break
      }
      case 'MY_FIRST_CONTEXT_SUBCONTEXT_B': {
        fragment = <MySubcontextB {...this.props} />
        break
      }
      case 'MY_FIRST_CONTEXT_SUBCONTEXT_C': {
        fragment = <MySubcontextC {...this.props} />
        break
      }
    }

    return (
      <>
        <Layout
          id="my-first-context"
          column={[
            {
              node: (
                <div
                  style={{
                    padding: padding,
                  }}
                >
                  <Tabs
                    tabs={this.contexts}
                    active={this.state.context ?? ''}
                    direction="VERTICAL"
                    isFlex={isFlex}
                    maxVisibleTabs={3}
                    action={this.navHandler}
                  />
                </div>
              ),
              typeModifier: 'FIXED',
              fixedWidth: '148px',
            },
            {
              node: fragment,
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
