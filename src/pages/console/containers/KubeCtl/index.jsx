import React, { Component } from 'react'
import KubeModal from 'components/Modals/KubeCtl'

class KubeCtlWindow extends Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    return <KubeModal onCancel={this.pageClose} title="kubectl" />
  }
}

export default KubeCtlWindow
