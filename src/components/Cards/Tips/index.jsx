import React from 'react'
import { get } from 'lodash'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class Tips extends React.Component {
  state = {
    visible: localStorage.getItem(this.localStorageKey) !== 'false',
  }

  get localStorageKey() {
    return `${get(globals, 'user.username')}-${this.props.localStorageKey}`
  }

  toggleHelpDoc = visible => {
    localStorage.setItem(this.localStorageKey, String(visible))
    this.setState(
      {
        visible,
      },
      () => {
        this.props.onToggle && this.props.onToggle(visible)
      }
    )
  }

  showHelpDoc = () => {
    this.toggleHelpDoc(true)
  }

  hideHelpDoc = () => {
    this.toggleHelpDoc(false)
  }

  render() {
    const { wrapperClassName, article, tips } = this.props
    const { visible } = this.state
    return (
      <div className={classnames(styles.wrapper, wrapperClassName)}>
        {article}
        {visible ? (
          <div className={styles.helpDoc}>
            <div className={styles.doc}>{tips}</div>
            <div className={styles.hiddenBtn} onClick={this.hideHelpDoc}>
              * {t('Hide help information')}
            </div>
          </div>
        ) : (
          <div className={styles.openHelpButton} onClick={this.showHelpDoc}>
            <Icon name="question" size={24} />
          </div>
        )}
      </div>
    )
  }
}
