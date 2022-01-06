import React from 'react'

import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'

import { getLocalTime, getDisplayName } from 'utils'
import { ICON_TYPES, SECRET_TYPES } from 'utils/constants'
import { Button as KButton } from '@kube-design/components'

import SecretStore from 'stores/secret'
import { Form, Row, Col, Input } from 'antd'

@withProjectList({
  store: new SecretStore(),
  module: 'secrets',
  name: 'Secret',
})
export default class Secrets extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.table = React.createRef()
  }

  get itemActions() {
    const { getData, trigger, name } = this.props
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
        key: 'editSecret',
        icon: 'pen',
        text: t('Edit Secret'),
        action: 'edit',
        onClick: item =>
          trigger('secret.edit', {
            detail: item,
            success: getData,
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

  getColumns = () => {
    const { getSortOrder, module } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[module]}
            iconSize={40}
            title={getDisplayName(record)}
            desc={record.description || '-'}
            to={`${this.props.match.url}/${name}`}
            isMultiCluster={record.isFedManaged}
          />
        ),
      },
      {
        title: t('Type'),
        dataIndex: 'type',
        isHideable: true,
        width: '24%',
        render: type => (SECRET_TYPES[type] ? t(SECRET_TYPES[type]) : type),
      },
      {
        title: t('Config Number'),
        dataIndex: 'data',
        isHideable: true,
        width: '20%',
        render: data => Object.keys(data).length,
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
    const { match, module } = this.props
    return this.props.trigger('secret.create', {
      module,
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
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tabs={this.tabs} />
        <Table
          {...tableProps}
          onRef={node => {
            this.table = node
          }}
          hideSearch
          customFilter={this.renderCustomFilter()}
          formRef={this.form}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          searchType="name"
        />
      </ListPage>
    )
  }
}
