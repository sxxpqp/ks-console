import React from 'react'
import { computed } from 'mobx'
import { get } from 'lodash'
import { Tooltip, Icon } from '@kube-design/components'

import { Avatar, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'workspaces/components/ResourceTable'
import withList, { ListPage } from 'components/HOCs/withList'

import { getDisplayName, getLocalTime } from 'utils'
import { getSuitableValue, getValueByUnit } from 'utils/monitoring'

import ProjectStore from 'stores/project'
import ProjectMonitorStore from 'stores/monitoring/project'

const MetricTypes = {
  cpu: 'namespace_cpu_usage',
  memory: 'namespace_memory_usage_wo_cache',
  pod: 'namespace_pod_count',
}

@withList({
  store: new ProjectStore(),
  name: 'Project',
  module: 'projects',
  injectStores: ['rootStore', 'workspaceStore'],
})
export default class Projects extends React.Component {
  workspaceStore = this.props.workspaceStore

  monitoringStore = new ProjectMonitorStore()

  handleTabChange = value => {
    const { workspace } = this.props.match.params
    this.props.routing.push(`/workspaces/${workspace}/${value}`)
  }

  get tabs() {
    return {
      value: this.props.module,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'projects',
          label: t('Projects'),
        },
        {
          value: 'federatedprojects',
          label: t('Multi-cluster Projects'),
        },
      ],
    }
  }

  get showFederated() {
    return globals.app.isMultiCluster
  }

  @computed
  get clusters() {
    return this.workspaceStore.clusters.data.map(item => ({
      label: item.name,
      value: item.name,
      disabled: !item.isReady,
      cluster: item,
    }))
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get clusterProps() {
    return {
      clusters: this.clusters,
      cluster: this.workspaceStore.cluster,
      onClusterChange: this.handleClusterChange,
      showClusterSelect: globals.app.isMultiCluster,
    }
  }

  handleClusterChange = cluster => {
    this.workspaceStore.selectCluster(cluster)
  }

  getData = async ({ silent, ...params } = {}) => {
    const { store } = this.props

    silent && (store.list.silent = true)
    const { cluster } = this.workspaceStore
    if (cluster) {
      await store.fetchList({
        cluster,
        ...this.props.match.params,
        ...params,
        labelSelector:
          'kubefed.io/managed!=true, kubesphere.io/kubefed-host-namespace!=true',
      })
      const resources = store.list.data.map(item => item.name)
      if (resources.length > 0) {
        await this.monitoringStore.fetchMetrics({
          cluster,
          resources,
          ...this.props.match.params,
          metrics: Object.values(MetricTypes),
          last: true,
        })
      }
    }
    store.list.silent = false
  }

  get itemActions() {
    const { trigger, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item => trigger('resource.baseinfo.edit', { detail: item }),
      },
      {
        key: 'quotaEdit',
        icon: 'pen',
        text: t('Edit Quota'),
        action: 'edit',
        onClick: item =>
          trigger('project.quota.edit', {
            type: t('Project'),
            detail: item,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  getLastValue = (record, type, unit) => {
    const metricsData = this.monitoringStore.data
    const result = get(metricsData, `${type}.data.result`) || []
    const metrics = result.find(
      item => get(item, 'metric.namespace') === record.name
    )
    return getValueByUnit(get(metrics, 'value[1]', 0), unit)
  }

  getCheckboxProps = record => ({
    disabled: record.status === 'Terminating',
    name: record.name,
  })

  getColumns = () => {
    const { getSortOrder } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        render: (name, record) => (
          <Avatar
            to={
              record.status === 'Terminating' || record.isFedHostNamespace
                ? null
                : `/${this.workspace}/clusters/${record.cluster}/projects/${name}`
            }
            icon="project"
            iconSize={40}
            desc={record.description || '-'}
            title={this.renderTitle(record)}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        isHideable: true,
        render: status => <Status type={status} name={t(status)} flicker />,
      },
      {
        title: t('CPU Usage'),
        key: 'namespace_cpu_usage',
        isHideable: true,
        render: record =>
          getSuitableValue(
            this.getLastValue(record, MetricTypes.cpu),
            'cpu',
            '-'
          ),
      },
      {
        title: t('Memory Usage'),
        key: 'namespace_memory_usage_wo_cache',
        isHideable: true,
        render: record =>
          getSuitableValue(
            this.getLastValue(record, MetricTypes.memory),
            'memory',
            '-'
          ),
      },
      {
        title: t('Pod Count'),
        key: 'namespace_pod_count',
        isHideable: true,
        render: record => this.getLastValue(record, MetricTypes.pod),
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        isHideable: true,
        sorter: true,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  renderTitle(record) {
    if (record.isFedHostNamespace) {
      return (
        <span>
          <span className="margin-r8">{getDisplayName(record)}</span>
          <Tooltip content={t('FED_HOST_NAMESPACE_TIP')}>
            <Icon name="information" />
          </Tooltip>
        </span>
      )
    }

    return getDisplayName(record)
  }

  showCreate = () =>
    this.props.trigger('project.create', {
      ...this.props.match.params,
      defaultCluster: this.workspaceStore.cluster,
      success: cluster => {
        if (cluster) {
          this.workspaceStore.selectCluster(cluster)
        }
        this.getData({ silent: true })
      },
    })

  render() {
    const { match, bannerProps, tableProps } = this.props

    const matchParams = {
      ...match,
      params: {
        ...match.params,
        cluster: this.workspaceStore.cluster,
      },
    }

    const isLoadingMonitor = this.monitoringStore.isLoading

    return (
      <ListPage
        {...this.props}
        match={matchParams}
        getData={this.getData}
        module="namespaces"
      >
        <Banner {...bannerProps} tabs={this.showFederated ? this.tabs : {}} />
        <Table
          {...tableProps}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          searchType="name"
          {...this.clusterProps}
          isLoading={tableProps.isLoading || isLoadingMonitor}
          getCheckboxProps={this.getCheckboxProps}
        />
      </ListPage>
    )
  }
}
