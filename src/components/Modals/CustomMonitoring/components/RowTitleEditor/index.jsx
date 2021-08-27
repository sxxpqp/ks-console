import React from 'react'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class RowTitleEditor extends React.Component {
  state = {
    editing: false,
  }

  handleEditClick = () => {
    this.setState({ editing: true }, () => {
      this.inputRef.current.focus()
    })
  }

  inputRef = React.createRef()

  onChange = e => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  onBlur = () => {
    this.setState({ editing: false })
  }

  onKeyUp = e => {
    const isEnter = e.keyCode === 13
    isEnter && this.setState({ editing: false })
  }

  render() {
    const { editing } = this.state
    const { title, onDescClick, onAscClick, onDeleteClick } = this.props

    return (
      <div className={styles.wrapper}>
        <h3>
          {editing ? (
            <input
              ref={this.inputRef}
              type="text"
              value={title}
              onBlur={this.onBlur}
              onChange={this.onChange}
              onKeyUp={this.onKeyUp}
            />
          ) : (
            title
          )}
        </h3>
        <span className={styles.tools}>
          <Icon name={'pen'} onClick={this.handleEditClick} />
          <Icon name={'trash'} onClick={onDeleteClick} />
          <Icon name={'sort-descending'} onClick={onDescClick} />
          <Icon name={'sort-ascending'} onClick={onAscClick} />
        </span>
      </div>
    )
  }
}
