import React from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty } from 'lodash'

import { getAreaChartOps } from 'utils/monitoring'

import { Loading } from '@kube-design/components'
import { Empty } from 'components/Base'
import { SimpleArea } from 'components/Charts'

import styles from './index.scss'

export default class Charts extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    config: PropTypes.object,
    data: PropTypes.array,
  }

  static defaultTypes = {
    loading: false,
    config: {},
    data: [],
  }

  getItemName = item => get(item, 'metric.pod', '-')

  render() {
    const { loading, config, data } = this.props

    return (
      <div className={styles.charts}>
        <Loading spinning={loading}>
          <div className={styles.list}>
            {isEmpty(data) ? (
              <Empty />
            ) : (
              data.map(item => {
                const name = this.getItemName(item)
                const chartConfig = getAreaChartOps({
                  ...config,
                  legend: [config.legend || '-'],
                  data: [item],
                })

                if (isEmpty(chartConfig.data)) return null

                return (
                  <div key={name} className={styles.item}>
                    <div className={styles.title}>{name}</div>
                    <SimpleArea width="100%" {...chartConfig} />
                  </div>
                )
              })
            )}
          </div>
        </Loading>
      </div>
    )
  }
}
