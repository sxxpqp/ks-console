import React from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import { withClusterList, ListPage } from 'components/HOCs/withList'
import WorkloadStatus from 'projects/components/WorkloadStatus'
import StatusReason from 'projects/components/StatusReason'
import ResourceTable from 'clusters/components/ResourceTable'

import { getLocalTime, getDisplayName } from 'utils'
import { getWorkloadStatus } from 'utils/status'
import { WORKLOAD_STATUS, ICON_TYPES } from 'utils/constants'

import WorkloadStore from 'stores/workload'

@withClusterList({
  store: new WorkloadStore('statefulsets'),
  module: 'statefulsets',
  name: 'Workload',
  rowKey: 'uid',
})
export default class StatefulSets extends React.Component {
  handleTabChange = value => {
    const { cluster } = this.props.match.params
    this.props.routing.push(`/clusters/${cluster}/${value}`)
  }

  get tabs() {
    return {
      value: this.props.module,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'deployments',
          label: t('Deployments'),
        },
        {
          value: 'statefulsets',
          label: t('StatefulSets'),
        },
        {
          value: 'daemonsets',
          label: t('DaemonSets'),
        },
      ],
    }
  }

  showAction = record => !record.isFedManaged

  get itemActions() {
    const { module, trigger, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
          }),
      },
      {
        key: 'editYaml',
        icon: 'pen',
        text: t('Edit YAML'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('resource.yaml.edit', {
            detail: item,
          }),
      },
      {
        key: 'redeploy',
        icon: 'restart',
        text: t('Redeploy'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('workload.redeploy', {
            module,
            detail: item,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: this.showAction,
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  getStatus() {
    return WORKLOAD_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  getItemDesc = record => {
    const { status, reason } = getWorkloadStatus(record, this.props.module)
    const desc = reason ? (
      <StatusReason status={status} reason={t(reason)} data={record} />
    ) : (
      record.description || '-'
    )

    return desc
  }

  getCheckboxProps = record => ({
    disabled: record.isFedManaged,
    name: record.name,
  })

  getColumns = () => {
    const { getSortOrder, getFilteredValue, module } = this.props
    const { cluster } = this.props.match.params
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
            title={getDisplayName(record)}
            desc={this.getItemDesc(record)}
            isMultiCluster={record.isFedManaged}
            to={`/clusters/${cluster}/projects/${record.namespace}/${module}/${name}`}
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
        width: '22%',
        render: (status, record) => (
          <WorkloadStatus data={record} module={module} />
        ),
      },
      {
        title: t('Project'),
        dataIndex: 'namespace',
        isHideable: true,
        width: '22%',
        render: namespace => (
          <Link to={`/clusters/${cluster}/projects/${namespace}`}>
            {namespace}
          </Link>
        ),
      },
      {
        title: t('Created Time'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  showCreate = () => {
    const { query, match, module } = this.props
    return this.props.trigger('workload.create', {
      module,
      namespace: query.namespace,
      cluster: match.params.cluster,
    })
  }

  render() {
    const { match, bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tabs={this.tabs} />
        <ResourceTable
          {...tableProps}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          cluster={match.params.cluster}
          getCheckboxProps={this.getCheckboxProps}
        />
      </ListPage>
    )
  }
}
