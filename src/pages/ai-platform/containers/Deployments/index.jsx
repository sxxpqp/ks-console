import React from 'react'

import { Avatar, Modal } from 'components/Base'
import { Notify, Tooltip, Button as KButton } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import WorkloadStatus from 'projects/components/WorkloadStatus'
import StatusReason from 'projects/components/StatusReason'
import Table from 'components/Tables/List'
import DefaultModal from 'components/Modals/Default'
import CopyModel from 'components/Modals/CopyModel'

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
  Button,
  Radio,
} from 'antd'
import { omit, get, set } from 'lodash'

import {
  CaretRightOutlined,
  StopOutlined,
  RedoOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons'

@withProjectList({
  store: new WorkloadStore('deployments'),
  module: 'deployments',
  name: 'Workload',
})
export default class Deployments extends React.Component {
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

  // get tips() {
  //   return [
  //     {
  //       title: '资源选择',
  //       description: t('SERVICE_TYPES_A'),
  //     },
  //     {
  //       title: '应用选择',
  //       description: t('SCENARIOS_FOR_SERVICES_A'),
  //     },
  //   ]
  // }

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
      resource: item,
    })
  }

  handleCopy(item) {
    // eslint-disable-next-line no-console
    const { store } = this.props
    let yaml = {}
    store.fetchDetail(item).then(data => {
      const { serviceAccount, serviceAccountName } = get(
        data._originData,
        'spec.template.spec'
      )
      yaml = JSON.stringify(data._originData).replace(
        new RegExp(item.name, 'g'),
        `${item.name.split('-')[0]}-${Math.random()
          .toString(32)
          .substr(-6)}`
      )
      yaml = JSON.parse(yaml)
      const spec = get(data._originData, 'spec.template.spec')
      set(yaml, 'spec.template.spec', {
        ...spec,
        serviceAccount,
        serviceAccountName,
      })
      const { cluster, namespace, name } = item
      const modal = Modal.open({
        onOk: template => {
          yaml = typeof template.currentTarget === 'object' ? yaml : template
          // eslint-disable-next-line no-unused-vars
          store.create(yaml, { cluster, namespace }).then(() => {
            Modal.close(modal)
            Notify.success({ content: `复制成功` })
          })
        },
        title: `复制容器应用？`,
        desc: `确定复制容器应用${name}吗？（服务需要手动设置）`,
        modal: CopyModel,
        formTemplate: yaml,
        ...item,
      })
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
            to={{
              pathname: `${this.prefix}/${module}/${name}`,
              state: { prevPath: this.props.location.pathname },
            }}
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
                <Tooltip content="启动">
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#55bc8a' }}
                    onClick={() => this.handleStart(record)}
                  >
                    <CaretRightOutlined />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content="停止">
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    onClick={() => this.handleStop(record)}
                  >
                    <StopOutlined />
                  </Button>
                </Tooltip>
              )}
              <Tooltip content="重新部署">
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#fa8c16' }}
                  onClick={() => this.handleReload(record)}
                >
                  <RedoOutlined />
                </Button>
              </Tooltip>
              <Tooltip content="删除">
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#f5222d' }}
                  onClick={() => this.handleDelete(record)}
                >
                  <CloseCircleOutlined />
                </Button>
              </Tooltip>
              <Tooltip content="快速复制">
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#8c8c8c' }}
                  onClick={() => this.handleCopy(record)}
                >
                  <CopyOutlined />
                </Button>
              </Tooltip>
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
      // 把props上的其他属性也传过去
      ...omit(this.props, ['prefix']),
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
          title="工作负载"
          description="工作负载为应用提供负载均衡支持，弹性扩容，对容器的整个生命周期（启停、删除、更新等）进行管理。"
          tabs={this.tabs}
          // tips={this.tips}
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
