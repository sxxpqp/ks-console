import React from 'react'
import { inject, observer } from 'mobx-react'
import Banner from 'components/Cards/Banner'
// import { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { toJS } from 'mobx'
// import { cloneDeep, get, isEmpty, omit } from 'lodash'
import { omit } from 'lodash'
import ApplyStore from 'stores/apply'
import { parse } from 'qs'
import dayjs from 'dayjs'

import { Button, Tag, Popover } from 'antd'
import { Modal } from 'components/Base'
import DetailModal from 'components/Modals/AuditDetail'
import { Notify } from '@kube-design/components'
import classNames from 'classnames'

import {
  EyeOutlined,
  CloudDownloadOutlined,
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

  getData = () => {
    const params = parse(location.search.slice(1))
    this.store.fetchList({
      ...this.props.match.params,
      ...params,
    })
    // const tmp = {
    //   ...omit(this.props.match.params, 'namespace'),
    //   devops: 'ks-consolekkwfw',
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
        page: 1,
        limit: 10,
        ...params,
      })
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  // 查看详情
  handleDetail(record) {
    const modal = Modal.open({
      onOk: async () => {
        // store.delete(detail).then(() => {
        Modal.close(modal)
        // success && success()
        // })
      },
      detail: record,
      modal: DetailModal,
      // ...props,
    })
  }

  // 审批
  handleApply(record) {
    const modal = Modal.open({
      onOk: async () => {
        // store.delete(detail).then(() => {
        Notify.success({ content: `审批成功` })
        this.getData()
        Modal.close(modal)
        // success && success()
        // })
      },
      detail: record,
      modal: DetailModal,
      // ...props,
    })
  }

  // 部署应用
  handleDeploy(record) {
    const { workspace, cluster, namespace } = this.props.match.params
    const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}`
    this.routing.history.push(`${PATH}/apps/${record.app}`)
  }

  getColumns = () => {
    return [
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
        search: true,
        render: obj => obj.name || '未知',
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        width: '15%',
        sorter: true,
        render: time => dayjs(time).format('YYYY-MM-DD hh:mm:ss'),
      },
      {
        title: '事由',
        dataIndex: 'reason',
        search: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        search: true,
        render: val => {
          switch (val) {
            case 0:
              return <Tag color="processing">未审核</Tag>
            case 1:
              return <Tag color="success">已审核</Tag>
            case 2:
              return <Tag color="error">已驳回</Tag>
            default:
              return <Tag color="processing">未审核</Tag>
          }
        },
      },
      {
        title: '操作',
        width: '20%',
        // eslint-disable-next-line no-unused-vars
        render: (_, record) => {
          return (
            <div className={styles.btns}>
              <Button
                type="text"
                size="small"
                style={{ color: '#096dd9' }}
                onClick={() => this.handleDetail(record)}
              >
                <EyeOutlined />
                查看详情
              </Button>
              {record.app ? (
                <Popover content="点击部署" title="">
                  <Button
                    type="text"
                    size="small"
                    className={classNames(
                      record.status === 1 ? styles.active : styles.disabled
                    )}
                    onClick={() => this.handleDeploy(record)}
                    disabled={record.status !== 1}
                  >
                    <CloudDownloadOutlined />
                    部署应用
                  </Button>
                </Popover>
              ) : (
                ''
              )}
            </div>
          )
        },
      },
    ]
  }

  get enabledActions() {
    return [
      {
        key: 'create',
        type: 'control',
        onClick: () => {
          const { cluster, workspace, namespace } = this.props.match.params
          const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}`
          this.routing.history.push(`${PATH}/apply`)
        },
        text: '创建',
      },
    ]
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
      selectActions: [],
    }

    return (
      <Table
        rowKey="id"
        data={data}
        columns={this.getColumns()}
        filters={omitFilters}
        pagination={pagination}
        isLoading={isLoading}
        onFetch={this.handleFetch}
        searchType="name"
        tableActions={defaultTableProps}
        actions={this.enabledActions}
      />
    )
  }

  render() {
    // const { match } = this.props
    const bannerProps = {
      className: 'margin-b12',
      title: '容器资源申请历史',
      description: '人工智能平台用户申请的资源申请历史，查看资源审批进展。',
      module: 'review',
    }
    return (
      <div>
        <Banner {...bannerProps} />
        {this.renderContent()}
      </div>
    )
  }
}
