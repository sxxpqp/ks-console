import React from 'react'

import { Avatar } from 'components/Base'
import { Button as KButton } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import WorkloadStatus from 'projects/components/WorkloadStatus'
import StatusReason from 'projects/components/StatusReason'
import Table from 'components/Tables/List'

import { getLocalTime, getDisplayName } from 'utils'
import { getWorkloadStatus } from 'utils/status'
import { WORKLOAD_STATUS, ICON_TYPES } from 'utils/constants'

import WorkloadStore from 'stores/workload'

import {
  // Popover,
  Form,
  Row,
  Col,
  Input,
  Radio,
} from 'antd'

@withProjectList({
  store: new WorkloadStore('daemonsets'),
  module: 'daemonsets',
  name: 'Workload',
})
export default class DaemonSets extends React.Component {
  constructor(props) {
    super(props)
    this.props.rootStore.saveSelectNavKey('workloadsPods')
    this.form = React.createRef()
    this.table = React.createRef()
  }

  get prefix() {
    const { workspace, namespace, cluster } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}`
  }

  handleTabChange = value => {
    this.props.routing.push(`${this.prefix}/${value}`)
  }

  get tabs() {
    return {
      value: this.props.module,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'deployments',
          label: '无状态',
        },
        {
          value: 'statefulsets',
          label: '有状态',
        },
        {
          value: 'daemonsets',
          label: '守护进程',
        },
      ],
    }
  }

  get itemActions() {
    const { module, trigger, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
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
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
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
    const { match, module, projectStore } = this.props
    return this.props.trigger('workload.create', {
      module,
      projectDetail: projectStore.detail,
      namespace: match.params.namespace,
      cluster: match.params.cluster,
    })
  }

  renderCustomFilter() {
    const onReset = () => {
      this.table && this.table.clearFilter()
    }
    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch(values)
    }
    const radioChange = val => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch({ ...values, status: val })
    }

    return (
      <Form ref={this.form}>
        <Row justify="space-between" align="middle" className="margin-b12">
          <Row justify="space-between" gutter={15}>
            <Col>
              <Form.Item label="状态" name="status">
                <Radio.Group
                  defaultValue={''}
                  onChange={e => radioChange(e.target.value)}
                >
                  <Radio value={''}>全部</Radio>
                  <Radio value={'running'}>运行中</Radio>
                  <Radio value={'updating'}>更新中</Radio>
                  <Radio value={'stopped'}>已停止</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              label="名称"
              name="name"
              style={{ width: '280px', marginRight: '10px' }}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="应用"
              name="app"
              style={{ width: '280px', marginRight: '10px' }}
            >
              <Input placeholder="请输入应用的名称" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <KButton type="control" onClick={onSearch}>
                搜索
              </KButton>
              <KButton type="default" onClick={onReset}>
                清空
              </KButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner
          {...bannerProps}
          tabs={this.tabs}
          title="守护进程集"
          description="守护进程集 (DaemonSet)，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用。"
        />
        <Table
          onRef={node => {
            this.table = node
          }}
          {...tableProps}
          hideSearch
          customFilter={this.renderCustomFilter()}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          formRef={this.form}
        />
      </ListPage>
    )
  }
}
