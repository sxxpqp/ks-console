import React from 'react'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

const CLASSLISTS = ['A', 'B', 'C', 'D']

export default class CodeStatusCard extends React.PureComponent {
  static defaultProps = {
    hasIcon: false,
    title: '-',
    value: 0,
    url: '',
  }

  render() {
    const { hasIcon, title, value, resultClass, unit, url } = this.props
    const classContent = CLASSLISTS[parseInt(resultClass, 10) - 1]

    return (
      <div className={styles.resultCard}>
        <p className={styles.title}>
          {hasIcon ? <Icon name="debug" size={20} /> : null}
          {title}
          {resultClass ? (
            <span className={styles[classContent]}>{classContent}</span>
          ) : null}
        </p>
        <p className={styles.value}>
          {url ? (
            <a href={url} target="_blank" rel="noreferrer noopener">
              <span>{value}</span>
            </a>
          ) : (
            <span>{value}</span>
          )}
          <span className={styles.unit}>{unit}</span>
        </p>
      </div>
    )
  }
}
