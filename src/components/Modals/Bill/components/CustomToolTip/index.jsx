import React from 'react'
import { get, isNaN } from 'lodash'

import styles from './index.scss'

const CustomToolTip = (props = {}) => {
  if (!props.active) return null
  const data = props.payload || []

  return (
    <div className={styles.tooltip}>
      <div className={styles.list}>
        {data.map(item => {
          const { dataKey, name, value = 0, payload } = item

          if (isNaN(Number(value))) return null

          const color = get(item, 'payload.fill')

          return (
            <div key={dataKey} className={styles.item}>
              <i style={{ background: color }} />
              <label>{t(name)}:</label>
              <p>
                {value}({payload.unit})
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomToolTip
