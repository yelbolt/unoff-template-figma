import { PureComponent } from 'preact/compat'
import {
  Button,
  Input,
  Layout,
  layouts,
  SemanticMessage,
  texts,
} from '@unoff/ui'
import { WithTranslationProps } from '../components/WithTranslation'
import { WithConfigProps } from '../components/WithConfig'
import { sendPluginMessage } from '../../utils/pluginMessage'
import { BaseProps } from '../../types/app'

interface WelcomeProps
  extends BaseProps, WithConfigProps, WithTranslationProps {}

export default class Welcome extends PureComponent<WelcomeProps> {
  // Handlers
  handleOpenDocs = () =>
    sendPluginMessage(
      {
        pluginMessage: {
          type: 'OPEN_IN_BROWSER',
          data: { url: this.props.config.urls.documentationUrl },
        },
      },
      '*'
    )

  handleGetAccess = () =>
    sendPluginMessage(
      {
        pluginMessage: {
          type: 'OPEN_IN_BROWSER',
          data: { url: this.props.config.urls.storeUrl },
        },
      },
      '*'
    )

  // Render
  render() {
    return (
      <Layout
        id="welcome"
        column={[
          {
            node: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--size-pos-medium)',
                  padding: 'var(--size-pos-medium)',
                }}
              >
                <span
                  className={`${texts.type} ${texts['type--xlarge']} ${texts['type--bold']}`}
                >
                  {this.props.t('template.welcome.title', {
                    pluginName: this.props.config.information.pluginName,
                  })}
                </span>
                <span className={`${texts.type} ${texts['type--large']}`}>
                  {this.props.t('template.welcome.description')}
                </span>
                <Input
                  type="CODE"
                  value="unoff add skills"
                />
                <SemanticMessage
                  type="INFO"
                  message={this.props.t('template.welcome.skills.description')}
                  actionsSlot={
                    <div className={layouts['snackbar--tight']}>
                      <Button
                        type="secondary"
                        label={this.props.t('template.welcome.skills.cta.docs')}
                        action={this.handleOpenDocs}
                      />
                      <Button
                        type="primary"
                        label={this.props.t(
                          'template.welcome.skills.cta.access'
                        )}
                        action={this.handleGetAccess}
                      />
                    </div>
                  }
                />
                <span className={texts.type}>
                  {this.props.t('template.welcome.signature', {
                    author: (
                      <a
                        href={this.props.config.urls.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Yelbolt
                      </a>
                    ),
                  })}
                </span>
              </div>
            ),
            typeModifier: 'BLANK',
          },
        ]}
        isFullHeight
        isFullWidth
      />
    )
  }
}
