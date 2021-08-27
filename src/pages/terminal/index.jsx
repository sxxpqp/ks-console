import React, { Component } from 'react'
import Modal from 'components/Modals/ContianerTerminal'
import KubeModal from 'components/Modals/KubeCtl'

class TerminalApp extends Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    const pathSplit = window.location.pathname.split('/')
    const isKubeCtrl = pathSplit[2] === 'kubectl'
    const match = {
      params: {
        containerName: pathSplit[9],
        cluster: pathSplit[3],
        namespace: pathSplit[5],
        podName: pathSplit[7],
      },
    }

    if (isKubeCtrl) {
      return (
        <KubeModal
          onCancel={this.pageClose}
          title="kubectl"
          cluster={pathSplit[3]}
        />
      )
    }
    return <Modal onCancel={this.pageClose} match={match} title="terminal" />
  }
}

export default TerminalApp
