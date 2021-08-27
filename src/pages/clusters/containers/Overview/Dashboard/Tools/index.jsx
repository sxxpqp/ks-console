import React, { Component } from 'react'
import { Panel, Text } from 'components/Base'

import { createCenterWindowOpt } from 'utils/dom'

import styles from './index.scss'

export default class Tools extends Component {
  getWindowOpts() {
    return createCenterWindowOpt({
      width: 1200,
      height: 800,
      scrollbars: 1,
      resizable: 1,
    })
  }

  handleTool = e => {
    window.open(
      e.currentTarget.dataset.url,
      e.currentTarget.dataset.title,
      this.getWindowOpts()
    )
  }

  render() {
    const { cluster } = this.props
    return (
      <Panel title={t('Tools')}>
        <div className={styles.level}>
          <div
            className="margin-r12"
            data-title="KubeCtl"
            data-url={`/terminal/kubectl/${cluster}`}
            onClick={this.handleTool}
          >
            <Text
              icon="terminal"
              title="Kubectl"
              description={t('KUBECTL_DESC')}
            />
          </div>
          <div
            data-title="KubeConfig"
            data-url={`/clusters/${cluster}/kubeConfig`}
            onClick={this.handleTool}
          >
            <Text
              icon="data"
              title="KubeConfig"
              description={t('KUBECONFIG_DESC')}
            />
          </div>
        </div>
      </Panel>
    )
  }
}
