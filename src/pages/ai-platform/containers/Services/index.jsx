import React from 'react'

import { Avatar, Text } from 'components/Base'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import ServiceAccess from 'projects/components/ServiceAccess'
import { Button as KButton } from '@kube-design/components'

import { getLocalTime, getDisplayName } from 'utils'
import { ICON_TYPES, SERVICE_TYPES } from 'utils/constants'
import { Form, Row, Col, Input } from 'antd'

import ServiceStore from 'stores/service'

import Topology from './Topology'

@withProjectList({
  store: new ServiceStore(),
  module: 'services',
  name: 'Service',
})
export default class Services extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.table = React.createRef()
  }

  state = {
    type: 'list',
  }

  handleTabChange = value => {
    this.setState({ type: value })
  }

  get tabs() {
    const { cluster } = this.props.match.params
    if (!globals.app.hasClusterModule(cluster, 'network.topology')) {
      return {}
    }

    return {
      value: this.state.type,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'list',
          label: t('List'),
        },
        {
          value: 'topology',
          label: t('Topology'),
        },
      ],
    }
  }

  // get tips() {
  //   return [
  //     {
  //       title: t('SERVICE_TYPES_Q'),
  //       description: t('SERVICE_TYPES_A'),
  //     },
  //     {
  //       title: t('SCENARIOS_FOR_SERVICES_Q'),
  //       description: t('SCENARIOS_FOR_SERVICES_A'),
  //     },
  //   ]
  // }

  get itemActions() {
    const { trigger, name } = this.props
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
        key: 'editService',
        icon: 'network-router',
        text: t('Edit Service'),
        action: 'edit',
        onClick: item =>
          trigger('service.edit', {
            detail: item,
          }),
      },
      {
        key: 'editGateway',
        icon: 'ip',
        text: t('Edit Internet Access'),
        action: 'edit',
        show: record => record.type === SERVICE_TYPES.VirtualIP,
        onClick: item =>
          trigger('service.gateway.edit', {
            detail: item,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('service.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  get tableActions() {
    const { tableProps, name, rowKey, trigger } = this.props
    return {
      ...tableProps.tableActions,
      actions: [
        {
          key: 'create',
          type: 'control',
          text: '创建',
          onClick: this.showCreate,
        },
      ],
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('Delete'),
          action: 'delete',
          onClick: () =>
            trigger('service.batch.delete', {
              type: t(name),
              rowKey,
            }),
        },
      ],
    }
  }

  getColumns = () => {
    const { getSortOrder, module } = this.props
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
            desc={record.description || '-'}
            to={{
              pathname: `${this.props.match.url}/${name}`,
              state: { prevPath: this.props.location.pathname },
            }}
            isMultiCluster={record.isFedManaged}
          />
        ),
      },
      {
        title: t('Service Type'),
        dataIndex: 'annotations["kubesphere.io/serviceType"]',
        isHideable: true,
        width: '16%',
        // eslint-disable-next-line no-unused-vars
        render: (serviceType, record) => (
          <Text
            title={
              serviceType
                ? t(`SERVICE_TYPE_${serviceType.toUpperCase()}`)
                : t('Custom Creation')
            }
            // description={record.type || '-'}
          />
        ),
      },
      // {
      //   title: t('Application'),
      //   dataIndex: 'app',
      //   isHideable: true,
      //   search: true,
      //   width: '22%',
      // },
      {
        title: t('Internet Access'),
        dataIndex: 'specType',
        isHideable: true,
        width: '20%',
        render: (_, record) => <ServiceAccess data={record} />,
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
    return this.props.trigger('service.create', {
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

    return (
      <Form ref={this.form}>
        <Row justify="space-between" align="middle" className="margin-b12">
          <Row justify="space-between" gutter={15}>
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
          <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const { type } = this.state
    const { bannerProps, tableProps, match } = this.props
    return (
      <ListPage {...this.props}>
        <Banner
          {...bannerProps}
          title="外部服务"
          description="对于Docker应用，根据需求对外提供的一些接口服务，设置服务端口。"
          tabs={this.tabs}
          // tips={this.tips}
        />
        {type === 'topology' ? (
          <Topology match={match} />
        ) : (
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
            formRef={this.form}
            // onCreate={this.showCreate}
          />
        )}
      </ListPage>
    )
  }
}
