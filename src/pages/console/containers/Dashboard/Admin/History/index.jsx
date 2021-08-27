import React, { Component } from 'react'
import { isEmpty, isArray } from 'lodash'
import classNames from 'classnames'

import { Text } from 'components/Base'

import { safeParseJSON } from 'utils'

import Card from './Card'

import styles from './index.scss'

export default class History extends Component {
  get histories() {
    const caches = safeParseJSON(localStorage.getItem('history-cache'), {})
    return caches[globals.user.username] || []
  }

  render() {
    const { className } = this.props
    const histories = this.histories

    if (isEmpty(histories) || !isArray(histories)) {
      return (
        <div className={styles.empty}>
          <Text
            title={t('NO_HISTORY_TITLE')}
            description={t('NO_HISTORY_DESC')}
          />
        </div>
      )
    }

    return (
      <div className={classNames(styles.histories, className)}>
        {histories.map(item => (
          <Card key={item.url} data={item} />
        ))}
      </div>
    )
  }
}
