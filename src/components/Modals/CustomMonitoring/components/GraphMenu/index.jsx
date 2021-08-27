import React from 'react'

import { isObject } from 'lodash'
import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class GraphMenu extends React.Component {
  state = {
    collapse: true,
  }

  handleTitleClick = () => {
    this.setState(({ collapse }) => ({ collapse: !collapse }))
  }

  render() {
    const { title, metrics } = this.props
    const { collapse } = this.state

    return (
      <div className={styles.wrapper}>
        <h3 onClick={this.handleTitleClick}>
          <span>{title}</span>
          <small>
            <Icon name={collapse ? 'chevron-right' : 'chevron-down'} />
          </small>
        </h3>
        {!collapse && (
          <div className={styles.legendsContainer}>
            {metrics.map((metric, index) => (
              <div className={styles.legends} key={index}>
                <p>
                  <small style={{ backgroundColor: metric.color }} />
                  <span title={metric.title}>{metric.title}</span>
                </p>
                <div className={styles.subMetrics}>
                  {isObject(metric.value) &&
                    Object.entries(metric.value).map(([key, value]) => (
                      <div key={key}>
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
