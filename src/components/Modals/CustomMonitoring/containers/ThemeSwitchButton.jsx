import React from 'react'
import { inject } from 'mobx-react'
import Button from '../components/SquareButton'

function ThemeSwitchButton({ modalStore }) {
  function changeTheme() {
    modalStore.changeTheme()
  }

  return <Button type="control" icon="theme" onClick={changeTheme} />
}

export default inject('modalStore')(ThemeSwitchButton)
