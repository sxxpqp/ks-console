import React from 'react'
import Modal from 'components/Modals/ContianerTerminal'

export default class Terminal extends React.Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    return (
      <Modal
        icon="terminal"
        title={t('Terminal')}
        match={this.props.match}
        onCancel={this.pageClose}
      />
    )
  }
}
