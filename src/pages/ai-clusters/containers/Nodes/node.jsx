import React from 'react'
import { isEmpty, get } from 'lodash'
import { Tooltip, Icon } from '@kube-design/components'

import { cpuFormat, memoryFormat } from 'utils'
import { ICON_TYPES, NODE_STATUS } from 'utils/constants'
import { getNodeStatus } from 'utils/node'
import { getValueByUnit } from 'utils/monitoring'
import NodeStore from 'stores/node'
import NodeMonitoringStore from 'stores/monitoring/node'

import { withClusterList, ListPage } from 'components/HOCs/withList'

import { Avatar, Status, Panel, Text } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'

import { toJS } from 'mobx'
import { metrics_filter } from 'stores/rank/node'
import styles from './index.scss'

const MetricTypes = {
  cpu_used: 'node_cpu_usage',
  cpu_total: 'node_cpu_total',
  cpu_utilisation: 'node_cpu_utilisation',
  memory_used: 'node_memory_usage_wo_cache',
  memory_total: 'node_memory_total',
  memory_utilisation: 'node_memory_utilisation',
  pod_used: 'node_pod_running_count',
  pod_total: 'node_pod_quota',
}

@withClusterList({
  store: new NodeStore(),
  name: 'Cluster Node',
  module: 'nodes',
})
export default class Nodes extends React.Component {
  store = this.props.store

  monitoringStore = new NodeMonitoringStore({ cluster: this.cluster })

  componentDidMount() {
    this.store.fetchCount(this.props.match.params)
    this.props.rootStore.myClusters = {
      cluster: this.cluster,
      workspace: this.workspace,
      namespace: this.namespace,
    }
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get namespace() {
    return this.props.match.params.namespace
  }

  // get tips() {
  //   return [
  //     {
  //       title: t('NODE_TYPES_Q'),
  //       description: t('NODE_TYPES_A'),
  //     },
  //     {
  //       title: t('WHAT_IS_NODE_TAINTS_Q'),
  //       description: t('WHAT_IS_NODE_TAINTS_A'),
  //     },
  //   ]
  // }

  get itemActions() {
    const { store, clusterStore, routing, trigger, name } = this.props
    return [
      {
        key: 'uncordon',
        icon: 'start',
        text: t('Uncordon'),
        action: 'edit',
        show: item =>
          item.importStatus === 'success' && this.getUnschedulable(item),
        onClick: item => store.uncordon(item).then(routing.query),
      },
      {
        key: 'cordon',
        icon: 'stop',
        text: t('Cordon'),
        action: 'edit',
        show: item =>
          item.importStatus === 'success' && !this.getUnschedulable(item),
        onClick: item => store.cordon(item).then(routing.query),
      },
      {
        key: 'logs',
        icon: 'eye',
        text: t('Show Logs'),
        action: 'edit',
        show: item => item.importStatus !== 'success',
        onClick: () =>
          trigger('node.add.log', { detail: toJS(clusterStore.detail) }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: item => item.importStatus === 'failed',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
            success: routing.query,
          }),
      },
    ]
  }

  get tableActions() {
    const { trigger, routing, clusterStore, tableProps } = this.props
    const actions = []
    if (clusterStore.detail.kkName) {
      actions.push({
        key: 'add',
        type: 'control',
        text: t('Add Node'),
        action: 'create',
        onClick: () =>
          trigger('node.add', {
            kkName: clusterStore.detail.kkName || 'ddd',
          }),
      })
    }

    return {
      ...tableProps.tableActions,
      actions,
      selectActions: [
        {
          key: 'taint',
          type: 'default',
          text: t('Taint Management'),
          action: 'edit',
          onClick: () =>
            trigger('node.taint.batch', {
              success: routing.query,
            }),
        },
      ],
    }
  }

  getData = async params => {
    await this.store.fetchList({
      ...params,
      ...this.props.match.params,
    })
    debugger
    await this.monitoringStore.fetchMetrics({
      ...this.props.match.params,
      resources: this.store.list.data.map(node => node.name),
      // metrics: Object.values(MetricTypes),
      metrics: metrics_filter,
      last: true,
    })
  }

  getUnschedulable = record => {
    const taints = record.taints

    return taints.some(
      taint => taint.key === 'node.kubernetes.io/unschedulable'
    )
  }

  getLastValue = (node, type, unit) => {
    const metricsData = this.monitoringStore.data
    const result = get(metricsData[type], 'data.result') || []
    const metrics = result.find(item => get(item, 'metric.node') === node.name)
    return getValueByUnit(get(metrics, 'value[1]', 0), unit)
  }

  getRecordMetrics = (record, configs) => {
    const metrics = {}
    configs.forEach(cfg => {
      metrics[cfg.type] = parseFloat(
        this.getLastValue(record, MetricTypes[cfg.type], cfg.unit)
      )
    })
    return metrics
  }

  renderTaintsTip = data => (
    <div>
      <div>{t('Taints')}:</div>
      <div>
        {data.map(item => {
          const text = `${item.key}=${item.value || ''}:${item.effect}`
          return <div key={text}>{text}</div>
        })}
      </div>
    </div>
  )

  getStatus() {
    return NODE_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  getColumns = () => {
    // const { module, prefix, getSortOrder, getFilteredValue } = this.props
    const { module, getSortOrder, getFilteredValue } = this.props
    // /clusters/default/nodes/node1/status

    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[module]}
            iconSize={40}
            to={
              record.importStatus !== 'success'
                ? null
                : `/clusters/${this.cluster}/nodes/${name}/status`
            }
            title={name}
            desc={record.ip}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        filters: this.getStatus(),
        filteredValue: getFilteredValue('status'),
        isHideable: true,
        search: true,
        render: (_, record) => {
          const status = getNodeStatus(record)
          const taints = record.taints

          return (
            <div className={styles.status}>
              <Status
                type={status}
                name={t(`NODE_STATUS_${status.toUpperCase()}`)}
              />
              {!isEmpty(taints) && record.importStatus === 'success' && (
                <Tooltip content={this.renderTaintsTip(taints)}>
                  <span className={styles.taints}>{taints.length}</span>
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        isHideable: true,
        search: true,
        render: roles => roles.join(','),
      },
      {
        title: t('CPU'),
        key: 'cpu',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'cpu_used',
              unit: 'Core',
            },
            {
              type: 'cpu_total',
              unit: 'Core',
            },
            {
              type: 'cpu_utilisation',
            },
          ])

          return (
            <Text
              title={
                <div className={styles.resource}>
                  <span>{`${Math.round(metrics.cpu_utilisation * 100)}%`}</span>
                  {metrics.cpu_utilisation >= 0.9 && (
                    <Icon name="exclamation" />
                  )}
                </div>
              }
              description={`${metrics.cpu_used}/${metrics.cpu_total} Core`}
            />
          )
        },
      },
      {
        title: t('Memory'),
        key: 'memory',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'memory_used',
              unit: 'Gi',
            },
            {
              type: 'memory_total',
              unit: 'Gi',
            },
            {
              type: 'memory_utilisation',
            },
          ])

          return (
            <Text
              title={
                <div className={styles.resource}>
                  <span>{`${Math.round(
                    metrics.memory_utilisation * 100
                  )}%`}</span>
                  {metrics.memory_utilisation >= 0.9 && (
                    <Icon name="exclamation" />
                  )}
                </div>
              }
              description={`${metrics.memory_used}/${metrics.memory_total} Gi`}
            />
          )
        },
      },
      {
        title: t('Pods'),
        key: 'pods',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'pod_used',
            },
            {
              type: 'pod_total',
            },
          ])
          const uitilisation = metrics.pod_total
            ? parseFloat(metrics.pod_used / metrics.pod_total)
            : 0

          return (
            <Text
              title={`${Math.round(uitilisation * 100)}%`}
              description={`${metrics.pod_used}/${metrics.pod_total}`}
            />
          )
        },
      },
      {
        title: t('Allocated CPU'),
        key: 'allocated_resources_cpu',
        isHideable: true,
        render: this.renderCPUTooltip,
      },
      {
        title: t('Allocated Memory'),
        key: 'allocated_resources_memory',
        isHideable: true,
        render: this.renderMemoryTooltip,
      },
    ]
  }

  renderCPUTooltip = record => {
    const content = (
      <p>
        {t('Resource Limits')}:{' '}
        {cpuFormat(get(record, 'annotations["node.kubesphere.io/cpu-limits"]'))}{' '}
        Core (
        {get(record, 'annotations["node.kubesphere.io/cpu-limits-fraction"]')})
      </p>
    )
    return (
      <Tooltip content={content} placement="top">
        <Text
          title={`${cpuFormat(
            get(record, 'annotations["node.kubesphere.io/cpu-requests"]')
          )} Core (${get(
            record,
            'annotations["node.kubesphere.io/cpu-requests-fraction"]'
          )})`}
          description={t('Resource Requests')}
        />
      </Tooltip>
    )
  }

  renderMemoryTooltip = record => {
    const content = (
      <p>
        {t('Resource Limits')}:{' '}
        {memoryFormat(
          get(record, 'annotations["node.kubesphere.io/memory-limits"]'),
          'Gi'
        )}{' '}
        Gi (
        {get(
          record,
          'annotations["node.kubesphere.io/memory-limits-fraction"]'
        )}
        )
      </p>
    )
    return (
      <Tooltip content={content} placement="top">
        <Text
          title={`${memoryFormat(
            get(record, 'annotations["node.kubesphere.io/memory-requests"]'),
            'Gi'
          )} Gi (${get(
            record,
            'annotations["node.kubesphere.io/memory-requests-fraction"]'
          )})`}
          description={t('Resource Requests')}
        />
      </Tooltip>
    )
  }

  renderOverview() {
    const { masterCount, masterWorkerCount, list } = this.store
    const totalCount = list.total
    const workerCount = Math.max(
      Number(totalCount) - Number(masterCount) + Number(masterWorkerCount),
      0
    )

    return (
      <Panel className="margin-b12">
        <div className={styles.overview}>
          <Text icon="nodes" title={totalCount} description={t('Node Count')} />
          <Text title={masterCount} description={t('Master Node')} />
          <Text title={workerCount} description={t('Worker Node')} />
        </div>
      </Panel>
    )
  }

  render() {
    const { bannerProps, tableProps } = this.props
    const isLoadingMonitor = this.monitoringStore.isLoading

    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Banner {...bannerProps} />
        {this.renderOverview()}
        <Table
          className={styles.tableWrapper}
          {...tableProps}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          isLoading={tableProps.isLoading || isLoadingMonitor}
        />
      </ListPage>
    )
  }
}
