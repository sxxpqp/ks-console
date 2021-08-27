import React from 'react'
import KubeConfig from 'components/Modals/KubeConfig'

export default class KubeConfigModal extends React.Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    return (
      <KubeConfig
        title={t('kubeconfig')}
        match={this.props.match}
        onCancel={this.pageClose}
      />
    )
  }
}
