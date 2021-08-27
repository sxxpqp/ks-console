import React from 'react'
import { observer, inject } from 'mobx-react'

import SquareButton from '../components/SquareButton'

@inject('monitoringStore')
@observer
export default class SwitchModeButton extends React.Component {
  handleEditClick = () => {
    this.props.monitoringStore.changeModeToEditing()
  }

  render() {
    const { isEditing } = this.props.monitoringStore

    return isEditing ? (
      <SquareButton
        type="danger"
        icon="pen"
        iconType="light"
        onClick={this.props.onSaveClick}
        text={t('Save')}
      >
        {t('SAVE_TEMPLATE')}
      </SquareButton>
    ) : (
      <SquareButton
        type="control"
        icon="pen"
        iconType="light"
        onClick={this.handleEditClick}
      >
        {t('EDIT_TEMPLATE')}
      </SquareButton>
    )
  }
}
