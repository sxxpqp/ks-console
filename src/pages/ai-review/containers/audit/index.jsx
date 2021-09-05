import React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import Banner from 'components/Cards/Banner'
// import { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { toJS } from 'mobx'
// import { cloneDeep, get, isEmpty, omit } from 'lodash'
import { omit } from 'lodash'
import ApplyStore from 'stores/apply'
import { parse } from 'qs'
import dayjs from 'dayjs'

import { Button } from 'antd'

import {
  EyeOutlined,
  AuditOutlined,
  ExportOutlined,
  // DeleteOutlined,
} from '@ant-design/icons'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class ApplyDefault extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ApplyStore()
  }

  getData = params => {
    this.props.store.fetchList({
      ...this.props.match.params,
      ...params,
    })
    // const tmp = {
    //   ...omit(this.props.match.params, 'namespace'),
    //   devops: 'default5tmqc',
    // }
    // this.props.rootStore.getRules(tmp)
  }

  get routing() {
    return this.props.rootStore.routing
  }

  // 请求列表
  componentDidMount() {
    this.unsubscribe = this.routing.history.subscribe(location => {
      const params = parse(location.search.slice(1))
      this.store.fetchList({
        ...this.props.match.params,
        filters: {
          page: 1,
          limit: 10,
        },
        ...params,
      })
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
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

  getColumns = () => [
    {
      title: '序号',
      dataIndex: 'id',
      width: '7%',
      render: val => {
        const { data, limit, page } = toJS(this.store.list)
        // 计算val的index
        // console.log(
        //   '🚀 ~ file: index.jsx ~ line 88 ~ ApplyDefault ~ data',
        //   data
        // )
        const index = data.findIndex(i => i.id === val)
        return index + limit * (page - 1) + 1
      },
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: '7%',
      isHideable: true,
      render: val => `${val}vCPU`,
    },
    {
      title: '内存',
      dataIndex: 'mem',
      width: '7%',
      isHideable: true,
      render: val => `${val}GiB`,
    },
    {
      title: '磁盘',
      dataIndex: 'disk',
      width: '7%',
      isHideable: true,
      render: val => `${val}GiB`,
    },
    {
      title: 'GPU',
      dataIndex: 'gpu',
      width: '7%',
      isHideable: true,
      render: val => `${val}vGPU`,
    },
    {
      title: '申请人',
      dataIndex: 'uid_user',
      width: '10%',
      render: obj => obj.name || '未知',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: '15%',
      render: time => dayjs(time).format('YYYY年MM月DD hh:mm:ss'),
    },
    {
      title: '事由',
      dataIndex: 'reason',
    },
    {
      title: '操作',
      width: '20%',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => {
        return (
          <div className={styles.btns}>
            <Button type="text" size="small" style={{ color: '#096dd9' }}>
              <EyeOutlined />
              查看详情
            </Button>
            <Button type="text" size="small" style={{ color: '#389e0d' }}>
              <AuditOutlined />
              审批
            </Button>
            <Button type="text" size="small" danger>
              <ExportOutlined />
              驳回
            </Button>
            {/* <Button type="text" danger size="small">
              <DeleteOutlined />
              删除
            </Button> */}
          </div>
        )
      },
    },
  ]

  get enabledActions() {
    return globals.app.getActions({
      module: 'pipelines',
      cluster: this.props.match.params.cluster,
      devops: this.devops,
    })
  }

  handleFetch = (params, refresh) => {
    this.routing.query(params, refresh)
  }

  renderContent() {
    const {
      data,
      filters,
      isLoading,
      total,
      page,
      limit,
      selectedRowKeys,
    } = toJS(this.store.list)

    const isEmptyList = isLoading === false && total === 0
    const omitFilters = omit(filters, ['limit', 'page'])

    const showCreate = this.enabledActions.includes('create')
      ? this.handleCreate
      : null

    if (isEmptyList && Object.keys(omitFilters).length <= 0) {
      return (
        <Empty
          name="Pipeline"
          action={
            showCreate ? (
              <Button onClick={showCreate} type="control">
                {t('Create')}
              </Button>
            ) : null
          }
        />
      )
    }

    const pagination = { total, page, limit }

    const defaultTableProps = {
      hideCustom: false,
      onSelectRowKeys: this.store.onSelectRowKeys,
      selectedRowKeys,
      selectActions: [
        {
          key: 'run',
          type: 'primary',
          text: t('Run'),
          action: 'delete',
          onClick: this.handleMultiBatchRun,
        },
        {
          key: 'delete',
          type: 'danger',
          text: t('Delete'),
          action: 'delete',
          onClick: () =>
            this.props.trigger('pipeline.batch.delete', {
              type: t('Pipeline'),
              rowKey: 'name',
              devops: this.devops,
              cluster: this.cluster,
              success: () => {
                setTimeout(() => {
                  this.handleFetch()
                }, 1000)
              },
            }),
        },
      ],
    }

    return (
      <Table
        rowKey="id"
        data={data}
        columns={this.getColumns()}
        // filters={omitFilters}
        pagination={pagination}
        isLoading={isLoading}
        // isLoading={isLoading}
        onFetch={this.handleFetch}
        // onCreate={showCreate}
        searchType="name"
        tableActions={defaultTableProps}
        // itemActions={this.itemActions}
        enabledActions={this.enabledActions}
      />
    )
  }

  render() {
    // const { match } = this.props
    const bannerProps = {
      className: 'margin-b12',
      title: '容器资源审批',
      description:
        '人工智能平台用户申请的资源清单，查看资源详情，对资源申请进行审批。',
      module: 'review',
    }
    return (
      <Provider getData={this.getData} {...this.props}>
        <Banner {...bannerProps} />
        {this.renderContent()}
      </Provider>
    )
  }
}
