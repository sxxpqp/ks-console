import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { Text } from 'components/Base'

import styles from './index.scss'

export default class WorkspaceItem extends Component {
  handleClick = () => {
    const { data, onClick } = this.props
    onClick(data)
  }

  render() {
    const { data, type, disabled } = this.props

    if (data.name === globals.config.systemWorkspace) {
      return null
    }

    return (
      <div
        className={classNames(styles.wrapper, { [styles.disabled]: disabled })}
        onClick={!disabled ? this.handleClick : null}
      >
        {!disabled && type === 'authed' && (
          <Icon name="chevron-left" size={20} />
        )}
        <Text
          className={styles.title}
          icon="enterprise"
          title={data.name}
          description={data.description || '-'}
          ellipsis
        />
        <Text
          className={styles.manager}
          title={data.manager}
          description={t('Manager')}
        />
        {!disabled && type !== 'authed' && (
          <Icon name="chevron-right" size={20} />
        )}
      </div>
    )
  }
}
