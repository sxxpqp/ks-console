import React from 'react'
import { inject, observer } from 'mobx-react'
import Banner from 'components/Cards/Banner'
// import { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { toJS } from 'mobx'
// import { cloneDeep, get, isEmpty, omit } from 'lodash'
// import { omit } from 'lodash'
import ApplyStore from 'stores/ai-platform/apply'
import { parse } from 'qs'
import dayjs from 'dayjs'

import { Button, Tag, Row, Col, Radio } from 'antd'
import { Modal } from 'components/Base'
import RefuseModal from 'components/Modals/Audit/refuse'
import AuditModal from 'components/Modals/Audit/index'
import DetailModal from 'components/Modals/AuditDetail'
import { Notify } from '@kube-design/components'
import { updateApply } from 'api/apply'
import ReviewStore from 'stores/ai-platform/review'
import {
  EyeOutlined,
  AuditOutlined,
  ExportOutlined,
  // DeleteOutlined,
} from '@ant-design/icons'
import { withProps } from 'utils'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class ApplyDefault extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ApplyStore()
    this.reviewStore = new ReviewStore()
    this.state = {
      type: 0,
      name: '',
    }
  }

  getData = param => {
    const params = parse(location.search.slice(1))
    this.store.fetchList({
      ...this.props.match.params,
      ...params,
      ...param,
      ...this.state,
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
    this.unsubscribe = this.routing.history.subscribe(() => {
      this.getData()
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

  // 驳回处理
  handleRefuse(item) {
    const modal = Modal.open({
      onOk: async msg => {
        // store.delete(detail).then(() => {
        const res = await updateApply({
          id: item.id,
          msg,
          status: 2, // 驳回
        })
        if (res.status === 200) {
          Notify.success({ content: `驳回成功` })
          this.getData()
        } else {
          Notify.error({ content: `驳回失败` })
        }
        Modal.close(modal)
        // success && success()
        // })
      },
      modal: RefuseModal,
      title: '确定驳回吗？',
      desc: `确定驳回 ${item.uid_user.name} 的资源申请吗？`,
      resource: `CPU:${item.cpu}vCPU, 内存:${item.mem}GiB, 磁盘:${item.disk}GiB, GPU:${item.gpu}vGPU`,
      reason: item.reason,
      // ...props,
    })
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
      modal: withProps(DetailModal, {
        reviewStore: this.reviewStore,
      }),
      // ...props,
    })
  }

  // 审批
  handleApply(item) {
    const modal = Modal.open({
      onOk: async data => {
        const res = await updateApply({
          id: item.id,
          msg: data.msg,
          status: 1, // 通过
          nid: data.rowData.id,
        })
        if (res.status === 200) {
          Notify.success({ content: `审批成功` })
          this.getData()
        } else {
          Notify.error({ content: `驳回失败` })
        }
        this.getData()
        Modal.close(modal)
        // success && success()
        // })
      },
      detail: item,
      modal: AuditModal,
      reviewStore: this.reviewStore,
      // ...props,
    })
  }

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
      dataIndex: 'user',
      width: '10%',
      render: obj => obj.name || '未知',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: '15%',
      render: time => dayjs(time).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '事由',
      dataIndex: 'reason',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
            {record.status === 0 ? (
              <>
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#389e0d' }}
                  onClick={() => this.handleApply(record)}
                >
                  <AuditOutlined />
                  审批
                </Button>
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={() => this.handleRefuse(record)}
                >
                  <ExportOutlined />
                  驳回
                </Button>
              </>
            ) : (
              <Button
                type="text"
                size="small"
                style={{ color: '#096dd9' }}
                onClick={() => this.handleDetail(record)}
              >
                <EyeOutlined />
                查看详情
              </Button>
            )}
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
    const { data, isLoading, total, page, limit, selectedRowKeys } = toJS(
      this.store.list
    )

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
        pagination={pagination}
        isLoading={isLoading}
        hideSearch
        // isLoading={isLoading}
        onFetch={this.handleFetch}
        // onCreate={showCreate}
        searchType="name"
        tableActions={defaultTableProps}
        // itemActions={this.itemActions}
        enabledActions={this.enabledActions}
        customFilter={this.renderTypeSearch()}
      />
    )
  }

  renderTypeSearch() {
    // eslint-disable-next-line no-unused-vars
    const { type, name } = this.state

    const onTypeChange = e => {
      // console.log(location.search)
      this.setState({ type: e.target.value })
      setTimeout(() => {
        this.getData()
      }, 0)
    }

    // const search = () => {
    //   this.getData({
    //     name,
    //     type,
    //   })
    // }

    // const clear = () => {
    //   this.setState({
    //     type: '',
    //     name: '',
    //   })
    //   this.getData({
    //     type: '',
    //   })
    // }

    return (
      <Row className={styles.flex}>
        <Col>
          <span>审核状态：</span>
          <Radio.Group
            name="type"
            defaultValue={''}
            onChange={onTypeChange}
            value={type}
          >
            <Radio value={''}>全部</Radio>
            <Radio value={0}>未审核</Radio>
            <Radio value={1}>已通过</Radio>
            <Radio value={2}>已驳回</Radio>
          </Radio.Group>
        </Col>
        {/* <Col>
          <Row>
            <AIButton type="control" onClick={search}>
              筛选
            </AIButton>
            <AIButton onClick={clear}>清空</AIButton>
          </Row>
        </Col> */}
      </Row>
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
      <div>
        <Banner {...bannerProps} />
        {/* {this.renderTypeSearch()} */}
        {this.renderContent()}
      </div>
    )
  }
}
