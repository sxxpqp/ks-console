import { isArray } from 'lodash'
import React from 'react'
import { RadioGroup } from '@kube-design/components'
import { ACCESS_MODES } from 'utils/constants'

import styles from './index.scss'

const Card = ({ name, value }) => (
  <div className={styles.accessMode}>
    <p className="name">{`${name}(${value})`}</p>
    <p className="desc">{t(`ACCESS_MODE_${value}`)}</p>
  </div>
)

const AccessModes = props => {
  if (props.loading) {
    return null
  }

  let accessModes = Object.keys(ACCESS_MODES).map(key => ({
    label: <Card name={key} value={ACCESS_MODES[key]} />,
    value: key,
  }))

  if (isArray(props.supportedAccessModes)) {
    accessModes = accessModes.filter(mode =>
      props.supportedAccessModes.includes(mode.value)
    )
  }

  return (
    <div className={styles.accessModeWrapper}>
      <RadioGroup options={accessModes} {...props} />
    </div>
  )
}

export default AccessModes
