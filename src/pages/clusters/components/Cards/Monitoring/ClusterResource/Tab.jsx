import React from 'react'
import classnames from 'classnames'

import { getSuitableUnit, getValueByUnit } from 'utils/monitoring'

import { SimpleCircle } from 'components/Charts'

import styles from './index.scss'

const TabItem = ({ active, name, used, total, unit, unitType }) => {
  const nameText = t(name)
  const _unit = getSuitableUnit(total || used, unitType) || unit
  const _used = getValueByUnit(used, _unit)
  const _total = getValueByUnit(total, _unit)

  return (
    <div
      className={classnames(styles.tab, {
        [styles.active]: active,
      })}
    >
      <SimpleCircle
        width={40}
        height={40}
        title={nameText}
        value={parseFloat(_used)}
        total={parseFloat(_total)}
        unit={_unit}
        showCenter={false}
        showRate={true}
        active={active}
      />
      <div className={styles.info}>
        <div className={styles.title}>
          {nameText} {t(_unit)}
        </div>
        <p title={`${_used}/${_total}`}>
          {_used}
          <span>/{_total}</span>
        </p>
      </div>
    </div>
  )
}

export default TabItem
