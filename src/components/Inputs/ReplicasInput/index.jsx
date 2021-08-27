import React from 'react'
import { Icon } from '@kube-design/components'
import styles from './index.scss'

export default class ReplicasInput extends React.Component {
  handleUp = () => {
    const { value, onChange } = this.props
    onChange && onChange(value + 1)
  }

  handleDown = () => {
    const { value, onChange } = this.props
    onChange && onChange(Math.max(value - 1, 1))
  }

  render() {
    const { value, onChange } = this.props

    return (
      <div className={styles.wrapper}>
        <span className={styles.value}>{value}</span>
        <span className={styles.text}>
          <p>
            <strong>{t('Replicas')}</strong>
          </p>
          <p>{t('Specify Replicas Number')}</p>
        </span>
        {onChange && (
          <span className={styles.buttons}>
            <Icon name="chevron-up" size={24} onClick={this.handleUp} />
            <Icon name="chevron-down" size={24} onClick={this.handleDown} />
          </span>
        )}
      </div>
    )
  }
}
