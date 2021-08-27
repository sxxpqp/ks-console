import React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { saveAs } from 'file-saver'
import fullScreen from 'components/Modals/FullscreenModal'
import UserTip from 'components/Cards/Tips'
import { Icon } from '@kube-design/components'
import { CodeEditor } from 'components/Base'

import TerminalStore from 'stores/terminal'

import styles from './index.scss'

@fullScreen
@observer
export default class KubeConfigModal extends React.Component {
  store = new TerminalStore()

  componentDidMount() {
    this.store.fetchKubeConfig(this.props.match.params)
  }

  handleDownload = () => {
    const text = this.store.kubeconfig
    const fileName = 'kubeconfig.yaml'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, fileName)
  }

  render() {
    return (
      <UserTip
        wrapperClassName={styles.kubectl}
        localStorageKey="kubectl-config"
        article={this.renderConfig()}
        tips={this.renderTips()}
        onToggle={this.onTipsToggle}
      />
    )
  }

  renderConfig() {
    const options = { readOnly: true }
    return (
      <div className={classnames(styles.pane, styles.terminal)}>
        <div className={styles.download} onClick={this.handleDownload}>
          <Icon name="download" size={20} type="light" />
          {`${t('Download')} KubeConfig`}
        </div>
        <CodeEditor value={this.store.kubeconfig} options={options} />
      </div>
    )
  }

  renderTips() {
    return (
      <div className={classnames('markdown-body', styles.tipWrapper)}>
        {t.html('KUBECONFIG_TIP')}
      </div>
    )
  }
}
