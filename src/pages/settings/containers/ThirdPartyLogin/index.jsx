import React, { Component } from 'react'

import { Button } from '@kube-design/components'
import { Panel, Text } from 'components/Base'
import Banner from 'components/Cards/Banner'
import OAuthModal from 'settings/components/Modals/OAuth'
import GithubOAuthModal from 'settings/components/Modals/GithubOAuth'

import styles from './index.scss'

export default class ThirdPartyLogin extends Component {
  state = {
    showOAuth: false,
    selectOAuth: {},
    showGithubOAuth: false,
  }

  get tips() {
    return [
      {
        title: t('THIRD_PARTY_LOGIN_Q'),
        description: t('THIRD_PARTY_LOGIN_A'),
      },
    ]
  }

  showOAuth = () => {
    this.setState({ showOAuth: true })
  }

  hideOAuth = () => {
    this.setState({ showOAuth: false })
  }

  handleOAuth = () => {
    this.hideOAuth()
  }

  showGithubOAuth = () => {
    this.setState({ showGithubOAuth: true })
  }

  hideGithubOAuth = () => {
    this.setState({ showGithubOAuth: false })
  }

  handleGithubOAuth = () => {
    this.hideGithubOAuth()
  }

  render() {
    const { showOAuth, selectOAuth, showGithubOAuth } = this.state
    return (
      <div>
        <Banner
          icon="passport"
          title={t('Third-party Login')}
          description={t('THIRD_PARTY_LOGIN_DESC')}
          tips={this.tips}
        />
        <div className={styles.title}>
          {t('Current third-party login configurations')}
        </div>
        <Panel>
          <Text
            icon="github"
            title="Github OAuth"
            description={t('Protocol Type')}
          />
          <div className={styles.status}>
            <Text
              title={`Github OAuth ${t('not configured')}`}
              description={
                'GitHub OAuth uses organization membership to grant access. '
              }
            />
            <Button onClick={this.showGithubOAuth}>
              {t('Configure')} Github OAuth
            </Button>
          </div>
        </Panel>
        <Panel>
          <Text
            icon="safe-notice"
            title="OAuth"
            description={t('Protocol Type')}
          />
          <div className={styles.status}>
            <Text
              title={`OAuth ${t('not configured')}`}
              description={t('OAUTH_DESC')}
            />
            <Button onClick={this.showOAuth}>{t('Configure')} OAuth</Button>
          </div>
        </Panel>
        <OAuthModal
          visible={showOAuth}
          detail={selectOAuth}
          onOk={this.handleOAuth}
          onCancel={this.hideOAuth}
        />
        <GithubOAuthModal
          visible={showGithubOAuth}
          detail={{}}
          onOk={this.handleGithubOAuth}
          onCancel={this.hideGithubOAuth}
        />
      </div>
    )
  }
}
