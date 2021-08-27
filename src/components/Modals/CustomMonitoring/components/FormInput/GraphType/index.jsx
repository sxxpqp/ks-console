import React from 'react'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default function GraphType({ type }) {
  const map = {
    singlestat: {
      i18n: t('SINGLE_STATE_CHART'),
      icon: 'text',
    },
    line: {
      i18n: t('LINE_CHART'),
      icon: 'linechart',
    },
    bar: {
      i18n: t('BAR_CHART'),
      icon: 'barchart',
    },
    table: {
      i18n: t('TABLE'),
      icon: 'table-chart',
    },
  }
  const icon = map[type].icon
  const title = map[type].i18n
  return (
    <div className={styles.wrapper}>
      <header>{t('CHART_TYPES')}</header>
      <div>
        <Icon name={icon} type="light" size={40} />
        <h3>{title}</h3>
      </div>
    </div>
  )
}
