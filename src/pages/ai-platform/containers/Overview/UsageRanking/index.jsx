import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'
import { Panel } from 'components/Base'
import { getValueByUnit, getSuitableUnit } from 'utils/monitoring'
import Store from 'stores/rank/workload'

import { Row, Radio } from 'antd'
import styles from './index.scss'

const UNITS = {
  workload_cpu_usage: 'cpu',
  workload_memory_usage_wo_cache: 'memory',
  workload_net_bytes_transmitted: 'bandwidth',
  workload_net_bytes_received: 'bandwidth',
}

@inject('rootStore')
@observer
class UsageRanking extends React.Component {
  constructor(props) {
    super(props)

    this.store = new Store({
      cluster: get(props.match, 'params.cluster'),
      namespaces: get(props.match, 'params.namespace'),
    })

    // this.state = {
    //   value: '',
    // }
  }

  componentDidMount() {
    this.setState({
      value: this.options[0].value,
    })
    this.store.fetchAll()
  }

  get options() {
    return this.store.sort_metric_options.map(option => ({
      value: option,
      label: t(`Sort By ${option}`),
    }))
  }

  getWorkloadLink(node) {
    const { owner_kind } = node

    if (owner_kind === 'Pod') {
      return
    }

    const { workload = '' } = node
    const workloadName = workload.replace(/\w+:/, '')
    const { workspace, cluster, namespace } = this.props.match.params
    const prefix = `${
      workspace ? `/${workspace}` : ''
    }/clusters/${cluster}/projects/${namespace}`
    const LINK_MAP = {
      Deployment: `${prefix}/deployments/${workloadName}`,
      StatefulSet: `${prefix}/statefulsets/${workloadName}`,
      DaemonSet: `${prefix}/daemonsets/${workloadName}`,
    }

    return LINK_MAP[owner_kind]
  }

  handleRadioChange(e) {
    // this.setState({
    //   value: e.target.value,
    // })
    this.store.changeSortMetric(e.target.value)
  }

  renderHeader() {
    // const { value } = this.state
    return (
      <div className={styles.header}>
        <Row justify="space-between" align="middle">
          <div className={styles.title}>{t('Resource Name')}</div>
          <div>
            <Radio.Group
              onChange={this.handleRadioChange.bind(this)}
              value={this.store.sort_metric}
            >
              {this.options.map(option => {
                let label = ''
                switch (option.value) {
                  case 'workload_cpu_usage':
                    label = 'CPU'
                    break
                  case 'workload_memory_usage_wo_cache':
                    label = '内存'
                    break
                  case 'workload_net_bytes_transmitted':
                    label = '网络Out'
                    break
                  case 'workload_net_bytes_received':
                    label = '网络In'
                    break
                  default:
                    label = option.label
                }
                return <Radio value={option.value}>{label}</Radio>
              })}
            </Radio.Group>
          </div>
        </Row>
      </div>
    )
  }

  renderEmpty() {
    return (
      <div className={styles.empty}>
        <Icon name="backup" size={32} />
        <div>{t('No Relevant Data')}</div>
      </div>
    )
  }

  renderContent() {
    const data = toJS(this.store.data)

    if (!this.store.isLoading && isEmpty(data)) {
      return this.renderEmpty()
    }

    return (
      <div className={styles.content}>
        {data.slice(0, 5).map(app => {
          const ICON_MAP = {
            Deployment: 'backup',
            StatefulSet: 'stateful-set',
            DaemonSet: 'deamon-set',
            Pod: 'pod',
            Default: 'backup',
          }

          const link = this.getWorkloadLink(app)
          const workloadName = app.workload.replace(/\w+:/, '')

          const percent =
            (app[this.store.sort_metric] * 100) /
            data[0][this.store.sort_metric]

          const unit = getSuitableUnit(
            app[this.store.sort_metric],
            UNITS[this.store.sort_metric]
          )
          return (
            <div className={styles.app} key={workloadName}>
              <div className={styles.appContent}>
                <Icon
                  name={ICON_MAP[app.owner_kind] || ICON_MAP.Default}
                  type="dark"
                  size={40}
                />
                <div className={styles.text}>
                  <div className="relative" data-tooltip={workloadName}>
                    <div>
                      {link ? (
                        <Link to={link}>{workloadName}</Link>
                      ) : (
                        workloadName
                      )}
                    </div>
                  </div>
                  <p>{t(app.owner_kind)}</p>
                </div>
                <div className={styles.value}>
                  {getValueByUnit(app[this.store.sort_metric], unit) || 0}
                  <span style={{ fontSize: 12 }}> {unit}</span>
                </div>
              </div>
              <div
                className={styles.background}
                style={{
                  width: `${percent.toFixed(2)}%`,
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <Panel
        className={styles.wrapper}
        title={`${t('Resources Usage Ranking')} (Top5)`}
      >
        {this.renderHeader()}
        {this.renderContent()}
      </Panel>
    )
  }
}

export default UsageRanking
