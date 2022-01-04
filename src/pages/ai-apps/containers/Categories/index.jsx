import React from 'react'
import {
  Column,
  Columns,
  Notify,
  Button as KButton,
} from '@kube-design/components'
import withList from 'components/HOCs/withList'
import Banner from 'components/Cards/Banner'
import AppStore from 'stores/openpitrix/store'
import CategoryStore from 'stores/openpitrix/category'
// import { Status } from 'components/Base'
import {
  getAppTagsSumApps,
  getAppByTagsId,
  updateAppTags,
  resetAppTags,
  batchSetAppTags,
} from 'api/platform'
import { Table, Tag, Button, Row, Col, Modal } from 'antd'
import dayjs from 'dayjs'
import {
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import Cates from './Cates'
import styles from './index.scss'
import EditModal from './form'

@withList({
  store: new AppStore(),
  module: 'apps',
  name: 'Application',
  rowKey: 'app_id',
})
export default class AppCategories extends React.Component {
  categoryStore = new CategoryStore()

  state = {
    selectedId: '',
    lists: [],
    total: 0,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      id: '',
      pageSizeOptions: [10, 20, 50, 100],
      onChange: this.handlePaginationChange.bind(this),
    },
    apps: [],
    show: false,
    item: null,
    selectedRows: [],
    selectedRowKeys: [],
    isBatch: false,
  }

  get prefix() {
    const { workspace, cluster, namespace } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/`
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    getAppTagsSumApps().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.setState({
          lists: data,
        })
      }
    })
  }

  // 获取应用列表
  getAppData(pagination, id) {
    getAppByTagsId({ ...pagination, id }).then(res => {
      const { code, data, total } = res
      if (code === 200) {
        this.setState({
          apps: data,
          pagination: {
            ...pagination,
            total,
          },
        })
      }
    })
  }

  // 分页
  handlePaginationChange(current, pageSize) {
    const { pagination, selectedId } = this.state
    this.setState({
      pagination: {
        ...pagination,
        current,
        pageSize,
      },
    })
    this.getAppData({ ...pagination, current, pageSize }, selectedId)
  }

  // 左侧单选
  handleSelectCategory = cate => {
    const { pagination } = this.state
    const newPaging = {
      ...pagination,
      current: 1,
      id: cate.id,
    }
    this.setState({
      selectedId: cate.id,
      pagination: newPaging,
    })
    this.getAppData(newPaging, cate.id)
  }

  // 编辑
  handleEdit(record) {
    this.setState({
      item: record,
      show: true,
      isBatch: false,
    })
  }

  // 详情
  handleDetail(record) {
    const { history } = this.props
    const type = record.type ? 'composing' : 'template'
    history.push({
      pathname: `${this.prefix}${type}/${record.appId}`,
      state: {
        prevPath: location.pathname,
      },
    })
  }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '分类',
      dataIndex: 'type',
      render: type =>
        type === 0 ? (
          <Tag color="processing">模板</Tag>
        ) : (
          <Tag color="success">自制</Tag>
        ),
    },

    {
      title: '创建时间',
      dataIndex: 'created',
      render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'more',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <div className={styles.btns}>
          <Button
            type="text"
            size="small"
            style={{ color: '#1890ff' }}
            icon={<EyeOutlined />}
            onClick={() => this.handleDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            size="small"
            style={{ color: '#1890ff' }}
            icon={<EditOutlined />}
            onClick={() => this.handleEdit(record)}
          >
            编辑
          </Button>
        </div>
      ),
    },
  ]

  // 批量设置
  handleBatchEdit() {
    this.setState({
      show: true,
      isBatch: true,
      item: null,
    })
  }

  // 重置标签
  handleBatchReset() {
    Modal.confirm({
      title: `确定重置选择的应用标签吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { selectedRowKeys, selectedId, pagination } = this.state
        resetAppTags({
          appIds: selectedRowKeys,
          tagId: selectedId,
        }).then(res => {
          if (res.code === 200) {
            Notify.success('重置成功')
            this.getData()
            this.getAppData(pagination, selectedId)
            this.setState({
              selectedRowKeys: [],
            })
          } else {
            Notify.success('重置失败，请重试')
          }
        })
      },
    })
  }

  render() {
    const {
      selectedId,
      lists,
      loading,
      apps,
      pagination,
      show,
      item,
      selectedRowKeys,
      isBatch,
    } = this.state

    const onCancel = () => {
      this.setState({ show: false, item: null })
    }

    const handleResult = res => {
      const { code } = res
      if (code === 200) {
        this.getData()
        this.setState({
          show: false,
          item: null,
          selectedRowKeys: [],
          selectedRows: [],
          pagination: {
            ...pagination,
            current: 1,
          },
        })
        Notify.success('更新成功')
      } else {
        Notify.error('更新失败，请重试')
      }
    }

    const onSubmit = data => {
      if (!isBatch) {
        // 编辑
        updateAppTags(data).then(handleResult)
        this.getAppData({ ...pagination }, selectedId)
      } else {
        // 批量编辑
        batchSetAppTags({
          appIds: selectedRowKeys,
          tagIds: data.tagId,
        }).then(handleResult)
        this.getAppData({ ...pagination, current: 1 }, selectedId)
      }

      onCancel()
    }

    const rowSelection = {
      onChange: (keys, selectedRows) => {
        this.setState({ selectedRows, selectedRowKeys: keys })
      },
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User',
      //   // Column configuration not to be checked
      //   name: record.name,
      // }),
    }

    return (
      <div>
        <Banner
          icon="tag"
          title={'应用分类标签管理'}
          description={'对于创建的应用进行打分类标签，用于筛选。'}
        />
        <Columns className={styles.main}>
          <Column className="is-3">
            <Cates
              lists={lists}
              selectedId={selectedId}
              onSelect={this.handleSelectCategory}
              loading={loading}
              renew={() => this.getData()}
            />
          </Column>
          <Column>
            {selectedRowKeys.length > 0 && (
              <Row className="margin-b12">
                <Col>
                  <KButton
                    type="control"
                    onClick={() => this.handleBatchEdit()}
                  >
                    批量设置
                  </KButton>
                  <KButton
                    type="danger"
                    onClick={() => this.handleBatchReset()}
                  >
                    重置标签
                  </KButton>
                </Col>
              </Row>
            )}
            <Table
              rowKey="appId"
              border
              columns={this.getColumns()}
              dataSource={apps}
              pagination={pagination}
              rowSelection={{
                selectedRowKeys,
                type: 'checkbox',
                ...rowSelection,
              }}
            />
          </Column>
        </Columns>
        <EditModal
          show={show}
          isBatch={isBatch}
          onCancel={onCancel}
          onSubmit={onSubmit}
          item={item}
          lists={lists}
        ></EditModal>
      </div>
    )
  }
}
