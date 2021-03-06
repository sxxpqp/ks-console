import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { Loading } from '@kube-design/components'
import { Panel } from 'components/Base'

import { getLastMonitoringData } from 'utils/monitoring'

import ClusterMonitorStore from 'stores/monitoring/cluster'

import ResourceItem from './ResourceItem'

import styles from './index.scss'

const MetricTypes = {
  cpu_usage: 'cluster_cpu_usage',
  cpu_total: 'cluster_cpu_total',
  memory_usage: 'cluster_memory_usage_wo_cache',
  memory_total: 'cluster_memory_total',
  disk_size_usage: 'cluster_disk_size_usage',
  disk_size_capacity: 'cluster_disk_size_capacity',
  pod_count: 'cluster_pod_running_count',
  pod_capacity: 'cluster_pod_quota',
}

@observer
export default class ResourcesUsage extends Component {
  monitorStore = new ClusterMonitorStore({ cluster: this.props.cluster })

  componentDidMount() {
    this.fetchData()
  }

  get metrics() {
    return this.monitorStore.data
  }

  getValue = data => get(data, 'value[1]', 0)

  fetchData = () => {
    this.monitorStore.fetchMetrics({
      metrics: Object.values(MetricTypes),
      last: true,
    })
  }

  getResourceOptions = () => {
    const data = getLastMonitoringData(this.metrics)
    return [
      {
        name: 'CPU',
        unitType: 'cpu',
        used: this.getValue(data[MetricTypes.cpu_usage]),
        total: this.getValue(data[MetricTypes.cpu_total]),
      },
      {
        name: 'Memory',
        unitType: 'memory',
        used: this.getValue(data[MetricTypes.memory_usage]),
        total: this.getValue(data[MetricTypes.memory_total]),
      },
      {
        name: 'Pod',
        unitType: '',
        used: this.getValue(data[MetricTypes.pod_count]),
        total: this.getValue(data[MetricTypes.pod_capacity]),
      },
      {
        name: 'Local Storage',
        unitType: 'disk',
        used: this.getValue(data[MetricTypes.disk_size_usage]),
        total: this.getValue(data[MetricTypes.disk_size_capacity]),
      },
    ]
  }

  getRadarOptions = options =>
    options.map(option => ({
      name: t(option.name),
      usage: Math.round((option.used * 100) / (option.total || option.used)),
    }))

  render() {
    const options = this.getResourceOptions()
    const radarOptions = this.getRadarOptions(options)

    return (
      <Panel title={t('Cluster Resources Usage')}>
        <Loading spinning={this.monitorStore.isLoading}>
          <div className={styles.wrapper}>
            <div className={styles.chart}>
              <RadarChart
                cx={180}
                cy={158}
                width={360}
                height={316}
                data={radarOptions}
              >
                <PolarGrid gridType="circle" />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar dataKey="usage" stroke="#345681" fill="#1c2d4267" />
              </RadarChart>
            </div>
            <div className={styles.list}>
              {options.map(option => (
                <ResourceItem key={option.name} {...option} />
              ))}
            </div>
          </div>
        </Loading>
      </Panel>
    )
  }
}
