import React from 'react'

import { Avatar, Modal } from 'components/Base'
import { Notify } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import WorkloadStatus from 'projects/components/WorkloadStatus'
import StatusReason from 'projects/components/StatusReason'
import Table from 'components/Tables/List'
import DefaultModal from 'components/Modals/Default'

import { getLocalTime, getDisplayName } from 'utils'
import { getWorkloadStatus } from 'utils/status'
import { WORKLOAD_STATUS, ICON_TYPES } from 'utils/constants'

import WorkloadStore from 'stores/workload'
import { Button } from 'antd'
import {
  CaretRightOutlined,
  StopOutlined,
  RedoOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

@withProjectList({
  store: new WorkloadStore('deployments'),
  module: 'deployments',
  name: 'Workload',
})
export default class Deployments extends React.Component {
  get prefix() {
    const { workspace, namespace, cluster } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}`
  }

  handleTabChange = value => {
    this.props.routing.push(`${this.prefix}/${value}`)
  }

  get tips() {
    return [
      {
        title: '资源选择',
        description: t('SERVICE_TYPES_A'),
      },
      {
        title: '应用选择',
        description: t('SCENARIOS_FOR_SERVICES_A'),
      },
    ]
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

  get itemActions() {
    // const { module, trigger, name } = this.props
    return [
      // {
      //   key: 'edit',
      //   icon: 'pen',
      //   text: t('Edit'),
      //   action: 'edit',
      //   onClick: item =>
      //     trigger('resource.baseinfo.edit', {
      //       detail: item,
      //     }),
      // },
      // {
      //   key: 'editYaml',
      //   icon: 'pen',
      //   text: t('Edit YAML'),
      //   action: 'edit',
      //   onClick: item =>
      //     trigger('resource.yaml.edit', {
      //       detail: item,
      //     }),
      // },
      // {
      //   key: 'redeploy',
      //   icon: 'restart',
      //   text: t('Redeploy'),
      //   action: 'edit',
      //   onClick: item =>
      //     trigger('workload.redeploy', {
      //       module,
      //       detail: item,
      //     }),
      // },
      // {
      //   key: 'delete',
      //   icon: 'trash',
      //   text: t('Delete'),
      //   action: 'delete',
      //   onClick: item =>
      //     trigger('workload.delete', {
      //       type: t(name),
      //       detail: item,
      //     }),
      // },
    ]
  }

  get tableActions() {
    const { trigger, name, rowKey, tableProps } = this.props
    return {
      ...tableProps.tableActions,
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('Delete'),
          action: 'delete',
          onClick: () =>
            trigger('workload.batch.delete', {
              type: t(name),
              rowKey,
            }),
        },
      ],
    }
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

  handleStart(record) {
    const { cluster, namespace, name } = record
    const { store } = this.props
    const modal = Modal.open({
      onOk: () => {
        store.scale({ cluster, namespace, name }, 1)
        Modal.close(modal)
        Notify.success({ content: `启动成功` })
      },
      title: `启动容器应用`,
      desc: `确定启动容器应用${name}吗？`,
      modal: DefaultModal,
      ...record,
    })
  }

  handleStop(record) {
    const { cluster, namespace, name } = record
    const { store } = this.props
    const modal = Modal.open({
      onOk: () => {
        store.scale({ cluster, namespace, name }, 0)
        Modal.close(modal)
        Notify.success({ content: `停止成功` })
      },
      title: `停止容器应用`,
      desc: `确定停止容器应用${name}吗？`,
      modal: DefaultModal,
      ...record,
    })
  }

  handleReload(item) {
    const { module, trigger } = this.props
    trigger('workload.redeploy', {
      module,
      detail: item,
    })
  }

  handleDelete(item) {
    const { trigger, name } = this.props
    trigger('workload.batch.delete', {
      type: t(name),
      detail: item,
    })
  }

  getColumns = () => {
    const { getSortOrder, getFilteredValue, module } = this.props
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
            to={`${this.prefix}/${module}/${name}`}
            isMultiCluster={record.isFedManaged}
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
        title: t('Application'),
        dataIndex: 'app',
        isHideable: true,
        search: true,
        width: '22%',
      },
      {
        title: t('Updated Time'),
        dataIndex: 'updateTime',
        sorter: true,
        sortOrder: getSortOrder('updateTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        width: 150,
        render: (time, record) => {
          return (
            <div>
              {!record.availablePodNums ? (
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#55bc8a' }}
                  onClick={() => this.handleStart(record)}
                >
                  <CaretRightOutlined />
                </Button>
              ) : (
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#096dd9' }}
                  onClick={() => this.handleStop(record)}
                >
                  <StopOutlined />
                </Button>
              )}
              <Button
                type="text"
                size="small"
                style={{ color: '#fa8c16' }}
                onClick={() => this.handleReload(record)}
              >
                <RedoOutlined />
              </Button>
              <Button
                type="text"
                size="small"
                style={{ color: '#f5222d' }}
                onClick={() => this.handleDelete(record)}
              >
                <CloseCircleOutlined />
              </Button>
            </div>
          )
        },
      },
    ]
  }

  showCreate = () => {
    const { match, module, projectStore } = this.props
    return this.props.trigger('workload.create', {
      module,
      projectDetail: projectStore.detail,
      namespace: match.params.namespace,
      cluster: match.params.cluster,
    })
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tabs={this.tabs} tips={this.tips} />
        <Table
          {...tableProps}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
        />
      </ListPage>
    )
  }
}
