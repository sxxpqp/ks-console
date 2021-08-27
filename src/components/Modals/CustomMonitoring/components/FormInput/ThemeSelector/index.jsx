import React from 'react'
import classnames from 'classnames'

import { isEqual, isArray } from 'lodash'

import styles from './index.scss'

export default function ThemeSelector({ options, value, onChange }) {
  return (
    <div className={styles.wrapper}>
      {options.map((option, index) => (
        <div
          className={classnames({
            [styles.select]: isEqual(option.value.join(','), value.join(',')),
          })}
          key={isArray(option.value) ? option.value.join(',') : index}
          onClick={() => {
            onChange(option.value)
          }}
        >
          <h3>{option.label}</h3>
          <div className={styles.colors}>
            {option.value.map(color => (
              <div key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
