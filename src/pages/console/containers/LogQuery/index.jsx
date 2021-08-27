import React from 'react'
import { observer, inject } from 'mobx-react'
import LogModal from 'components/Modals/LogSearch'

@inject('rootStore')
@observer
export default class Terminal extends React.Component {
  pageClose() {
    window.opener = null
    window.open('', '_self', '')
    window.close()
  }

  render() {
    return <LogModal title={t('Log Search')} onCancel={this.pageClose} />
  }
}
