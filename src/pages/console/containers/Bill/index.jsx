import React from 'react'
import Modal from 'components/Modals/Bill'

export default class BillModal extends React.Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    return (
      <Modal
        icon="wallet"
        title={t('Bill')}
        match={this.props.match}
        onCancel={this.pageClose}
      />
    )
  }
}
