import { PureComponent } from 'preact/compat'
import { FeatureStatus } from '@unoff/utils'
import { Layout, Tabs } from '@unoff/ui'
import ToDoList from '../subcontexts/ToDoList'
import LayerInspector from '../subcontexts/LayerInspector'
import ColorPalette from '../subcontexts/ColorPalette'
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

interface ExamplesProps
  extends BaseProps, WithConfigProps, WithTranslationProps {}

interface ExamplesState {
  context: Context | ''
}

export default class Examples extends PureComponent<
  ExamplesProps,
  ExamplesState
> {
  private contexts: Array<ContextItem>
  private theme: string | null

  static features = (
    planStatus: PlanStatus,
    config: ConfigContextType,
    service: Service,
    editor: Editor
  ) => ({
    EXAMPLES: new FeatureStatus({
      features: config.features,
      featureName: 'EXAMPLES',
      planStatus: planStatus,
      currentService: service,
      currentEditor: editor,
    }),
  })

  private get features() {
    return Examples.features(
      this.props.planStatus,
      this.props.config,
      this.props.service,
      this.props.editor
    )
  }

  constructor(props: ExamplesProps) {
    super(props)
    this.contexts = setContexts(
      [
        'EXAMPLES_TODO_LIST',
        'EXAMPLES_COLOR_PALETTE',
        'EXAMPLES_LAYER_INSPECTOR',
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
  componentDidUpdate(previousProps: Readonly<ExamplesProps>): void {
    if (previousProps.t !== this.props.t) {
      this.contexts = setContexts(
        [
          'EXAMPLES_TODO_LIST',
          'EXAMPLES_COLOR_PALETTE',
          'EXAMPLES_LAYER_INSPECTOR',
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
      case 'EXAMPLES_TODO_LIST': {
        fragment = <ToDoList {...this.props} />
        break
      }
      case 'EXAMPLES_COLOR_PALETTE': {
        fragment = <ColorPalette {...this.props} />
        break
      }
      case 'EXAMPLES_LAYER_INSPECTOR': {
        fragment = <LayerInspector {...this.props} />
        break
      }
    }

    return (
      <>
        <Layout
          id="examples"
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
