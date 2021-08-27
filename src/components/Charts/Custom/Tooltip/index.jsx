import React from 'react'
import { get, isEmpty, isNaN } from 'lodash'

import styles from './index.scss'

const CustomToolTip = (props = {}) => {
  if (!props.active) return null

  const { renderLabel, payload, usageData, totalData } = props
  const data = payload || []
  const timeStr = props.label
  const unit = get(data, '[0].unit') || ''
  const unitText = unit === 'default' ? '' : unit === '%' ? '%' : ` ${t(unit)}`

  const labelContent = renderLabel ? renderLabel(props) : timeStr

  return (
    <div className={styles.tooltip}>
      <div className={styles.label}>{labelContent}</div>
      <div className={styles.list}>
        {data.map(item => {
          const { dataKey, name, value = 0 } = item

          if (isNaN(Number(value))) return null

          const color = get(item, 'stroke')

          let ratio = ''
          if (!isEmpty(usageData) && !isEmpty(totalData)) {
            const usage =
              get(
                usageData.find(_item => _item.time === timeStr),
                name
              ) || 0
            const total =
              get(
                totalData.find(_item => _item.time === timeStr),
                name
              ) || 0
            ratio = <span>{` (${usage}/${total})`}</span>
          }

          return (
            <div key={dataKey} className={styles.item}>
              <i style={{ background: color }} />
              {t(name)}:{value}
              {unitText}
              {ratio}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomToolTip
