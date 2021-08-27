import React from 'react'

import { Text } from 'components/Base'
import { PieChart } from 'components/Charts'

import { getSuitableUnit, getValueByUnit } from 'utils/monitoring'

import styles from './index.scss'

export default function ResourceItem(props) {
  const title = t(props.name)
  const unit = getSuitableUnit(props.total, props.unitType) || unit
  const used = getValueByUnit(props.used, unit)
  const total = getValueByUnit(props.total, unit) || used

  return (
    <div className={styles.item}>
      <div className={styles.pie}>
        <PieChart
          width={48}
          height={48}
          data={[
            {
              name: 'Used',
              itemStyle: {
                fill: '#329dce',
              },
              value: used,
            },
            {
              name: 'Left',
              itemStyle: {
                fill: '#c7deef',
              },
              value: total - used,
            },
          ]}
        />
      </div>
      <Text
        title={`${Math.round((used * 100) / total)}%`}
        description={title}
      />
      <Text title={unit ? `${used} ${unit}` : used} description={t('Used')} />
      <Text
        title={unit ? `${total} ${unit}` : total}
        description={t('Total')}
      />
    </div>
  )
}
