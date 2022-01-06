import React from 'react'
import { capitalize } from 'lodash'

import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'
import { Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Avatar from 'apps/components/Avatar'
import { getLocalTime } from 'utils'

import { getAppCategoryNames, transferAppStatus } from 'utils/app'
import AppStore from 'stores/openpitrix/store'
import { toJS } from 'mobx'
import { Form, Row, Col, Input } from 'antd'
import { Button as KButton } from '@kube-design/components'

@withList({
  store: new AppStore(),
  module: 'apps',
  name: 'Apps',
  rowKey: 'app_id',
})
export default class Store extends React.Component {
  constructor(props) {
    super(props)
    this.store = this.props.rootStore
    this.table = React.createRef()
    this.form = React.createRef()
  }

  componentDidMount() {
    this.store.myClusters = toJS(this.props.match.params)
  }

  get itemActions() {
    return []
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: null,
      selectActions: [],
    }
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '30%',
      render: (name, app) => (
        <Avatar
          to={`/apps-manage/store/${app.app_id}`}
          avatar={app.icon}
          iconLetter={name}
          iconSize={40}
          title={name}
          desc={app.description}
        />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '10%',
      render: status => (
        <Status type={status} name={t(capitalize(transferAppStatus(status)))} />
      ),
    },
    {
      title: t('Workspace'),
      dataIndex: 'isv',
      isHideable: true,
      width: '10%',
    },
    {
      title: t('Latest Version'),
      dataIndex: 'latest_app_version.name',
      isHideable: true,
      width: '16%',
    },
    {
      title: t('App Category'),
      dataIndex: 'category_set',
      isHideable: true,
      width: '17%',
      render: categories => getAppCategoryNames(categories),
    },
    {
      title: t('Release / Suspended Time'),
      dataIndex: 'status_time',
      isHideable: true,
      width: '17%',
      render: time => getLocalTime(time).fromNow(),
    },
  ]

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
                name="keyword"
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
        </Row>
      </Form>
    )
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          {...bannerProps}
          title={t('App Store')}
          description={t('APP_STORE_DESC')}
        />
        <Table
          onRef={node => {
            this.table = node
          }}
          {...tableProps}
          hideSearch
          customFilter={this.renderCustomFilter()}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="keyword"
          formRef={this.form}
        />
      </ListPage>
    )
  }
}
