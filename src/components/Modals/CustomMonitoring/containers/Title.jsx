import React from 'react'
import { observer, inject } from 'mobx-react'

import TitleInput from '../components/TitleInput'

@inject('monitoringStore', 'modalStore')
@observer
export default class Title extends React.Component {
  handleChange = e => {
    this.props.monitoringStore.changeTitle(e.target.value)
  }

  render() {
    const { title, isEditing } = this.props.monitoringStore
    const { theme } = this.props.modalStore

    return (
      <TitleInput
        theme={theme}
        title={title}
        isEditing={isEditing}
        onChange={this.handleChange}
      />
    )
  }
}
