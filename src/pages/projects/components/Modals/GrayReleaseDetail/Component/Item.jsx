import React from 'react'
import { Link } from 'react-router-dom'
import { get } from 'lodash'
import { Icon } from '@kube-design/components'
import { Indicator } from 'components/Base'
import { getSuitableValue } from 'utils/monitoring'

import styles from './index.scss'

export default class Item extends React.Component {
  render() {
    const { data, prefix } = this.props
    const { type } = data.podStatus

    return (
      <li>
        <div className={styles.icon}>
          <Icon name="pod" size={24} />
          <Indicator
            type={type.toLowerCase()}
            className={styles.status}
            flicker
          />
        </div>
        <Link to={`${prefix}/pods/${data.name}`}>{data.name}</Link>
        <div className={styles.metric}>
          <Icon name="memory" size={20} />
          <div>
            {getSuitableValue(get(data, 'metrics.memory.value[1]'), 'memory')}
          </div>
        </div>
        <div className={styles.metric}>
          <Icon name="cpu" size={20} />
          <div>
            {getSuitableValue(get(data, 'metrics.cpu.value[1]'), 'cpu')}
          </div>
        </div>
      </li>
    )
  }
}
