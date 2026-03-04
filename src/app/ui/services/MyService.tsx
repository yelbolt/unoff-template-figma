import React from 'react'
import { PureComponent } from 'preact/compat'
import { FeatureStatus } from '@unoff/utils'
import { Bar, Tabs } from '@unoff/ui'
import MyThirdContext from '../contexts/MyThirdContext'
import MySecondContext from '../contexts/MySecondContext'
import MyFirstContext from '../contexts/MyFirstContext'
import { WithTranslationProps } from '../components/WithTranslation'
import { WithConfigProps } from '../components/WithConfig'
import { setContexts } from '../../utils/setContexts'
import { PluginMessageData } from '../../types/messages'
import {
  BaseProps,
  Context,
  ContextItem,
  PlanStatus,
  Service,
  Editor,
} from '../../types/app'
import { ConfigContextType } from '../../config/ConfigContext'

interface MyServiceProps
  extends BaseProps, WithConfigProps, WithTranslationProps {
  //
}

interface MyServiceState {
  context: Context | ''
  isPrimaryLoading: boolean
  isSecondaryLoading: boolean
}

export default class MyService extends PureComponent<
  MyServiceProps,
  MyServiceState
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
    return MyService.features(
      this.props.planStatus,
      this.props.config,
      this.props.service,
      this.props.editor
    )
  }

  constructor(props: MyServiceProps) {
    super(props)
    this.contexts = setContexts(
      ['MY_FIRST_CONTEXT', 'MY_SECOND_CONTEXT', 'MY_THIRD_CONTEXT'],
      props.planStatus,
      props.config.features,
      props.editor,
      props.service,
      props.t
    )
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
      isPrimaryLoading: false,
      isSecondaryLoading: false,
    }
    this.theme = document.documentElement.getAttribute('data-theme')
  }

  // Lifecycle
  componentDidMount = () => {
    window.addEventListener(
      'platformMessage',
      this.handleMessage as EventListener
    )
  }

  componentDidUpdate(previousProps: Readonly<MyServiceProps>): void {
    if (previousProps.t !== this.props.t) {
      this.contexts = setContexts(
        ['MY_FIRST_CONTEXT', 'MY_SECOND_CONTEXT', 'MY_THIRD_CONTEXT'],
        this.props.planStatus,
        this.props.config.features,
        this.props.editor,
        this.props.service,
        this.props.t
      )

      this.forceUpdate()
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener(
      'platformMessage',
      this.handleMessage as EventListener
    )
  }

  // Handlers
  handleMessage = (e: CustomEvent<PluginMessageData>) => {
    const path = e.detail

    const actions: {
      [action: string]: () => void
    } = {
      STOP_LOADER: () => {
        this.setState({
          isPrimaryLoading: false,
          isSecondaryLoading: false,
        })
      },
      DEFAULT: () => null,
    }

    return actions[path.type ?? 'DEFAULT']?.()
  }

  navHandler = (e: Event) =>
    this.setState({
      context: (e.currentTarget as HTMLElement).dataset.feature as Context,
    })

  // Renders
  render() {
    let fragment
    let isFlex = true

    switch (this.theme) {
      case 'figma':
        isFlex = false
        break
      case 'penpot':
        isFlex = true
        break
      case 'sketch':
        isFlex = false
        break
      case 'framer':
        isFlex = true
        break
      default:
        isFlex = true
    }

    switch (this.state.context) {
      case 'MY_FIRST_CONTEXT': {
        fragment = <MyFirstContext {...this.props} />
        break
      }
      case 'MY_SECOND_CONTEXT': {
        fragment = <MySecondContext {...this.props} />
        break
      }
      case 'MY_THIRD_CONTEXT': {
        fragment = <MyThirdContext {...this.props} />
        break
      }
    }

    return (
      <>
        <Bar
          leftPartSlot={
            <Tabs
              tabs={this.contexts}
              active={this.state.context ?? ''}
              isFlex={isFlex}
              maxVisibleTabs={2}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
        />
        <section className="context">{fragment}</section>
      </>
    )
  }
}
