import React from 'react'
// import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import {
  // Popover,
  Table,
  Row,
  Col,
  Input,
  Form,
  Button,
  Tag,
  Radio,
  Select,
  Modal,
} from 'antd'

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import { Button as KButton, Notify } from '@kube-design/components'
// import { observer } from 'mobx-react'
import { Status } from 'components/Base'

import OpAppStore from 'stores/openpitrix/application'
import CRDAppStore from 'stores/application/crd'
import ApplicationStore from 'stores/ai-platform/application'
import { withProjectList } from 'components/HOCs/withList'
import { get } from 'lodash'
import { getAppTags, removeApp, updateAppList } from 'api/platform'
import dayjs from 'dayjs'
import { TAGS_COLORS } from 'utils/constants'
import styles from './index.scss'

const { Option } = Select

@withProjectList({
  store: new OpAppStore(),
  module: 'applications',
  name: 'Application',
})
export default class CustomApplications extends React.Component {
  constructor(props) {
    super(props)
    this.crdAppStore = new CRDAppStore()
    this.appStore = new ApplicationStore()
    this.state = {
      tags: [],
    }
    this.form = React.createRef()
    this.appStore.getData()
    this.ctrl = null
  }

  get namespace() {
    return this.props.match.params.namespace
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get prefix() {
    const { workspace, cluster, namespace } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/`
  }

  componentDidMount() {
    // const { pagination } = this.state
    // this.getData(pagination)
    getAppTags().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.setState({
          tags: data,
        })
      }
    })
    this.ctrl = setInterval(async () => {
      const { namespace, workspace } = this.props.match.params
      await updateAppList({ namespace, workspace })
      await this.appStore.getData()
    }, 60 * 1000)
  }

  componentWillUnmount() {
    this.ctrl && clearInterval(this.ctrl)
  }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      // eslint-disable-next-line no-unused-vars
      render: (status, record) => {
        const label = status === 1 ? 'Running' : 'Warning'
        return <Status type={label} name={t(label)} />
      },
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
      title: '标签',
      dataIndex: 'app_labels',
      width: '20%',
      render: _ =>
        _.map(item => {
          const { tags, lists } = this.state
          if (lists && lists.length > 0) {
            const t =
              tags.findIndex(i => i.id === item.tagId) % TAGS_COLORS.length
            return <Tag color={TAGS_COLORS[t]}>{item.label.name}</Tag>
          }
          return null
        }),
    },
    // {
    //   title: '模板',
    //   dataIndex: 'appId',
    // },
    {
      title: '工作负载',
      dataIndex: 'deployments',
      align: 'center',
    },
    {
      title: '服务',
      dataIndex: 'services',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'more',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <div className={styles.btns}>
          <Button
            type="text"
            size="small"
            // style={{ color: '#1890ff' }}
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
            // onClick={}
          >
            编辑
          </Button>
          {/* <Popover content="删除" title=""> */}
          <Button
            type="text"
            size="small"
            style={{ color: '#ff7875' }}
            icon={<DeleteOutlined />}
            onClick={() => this.handleDelete(record)}
          >
            删除
          </Button>
          {/* </Popover> */}
        </div>
      ),
    },
  ]

  // 查看应用详情
  handleDetail = record => {
    const { history } = this.props
    const type = record.type ? 'composing' : 'template'
    history.push({
      pathname: `${this.prefix}${type}/${record.appId}`,
      state: {
        prevPath: location.pathname,
      },
    })
  }

  // 删除应用
  handleDelete = record => {
    Modal.confirm({
      title: `确定删除应用${record.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        removeApp(record.appId).then(res => {
          const { code } = res
          if (code === 200) {
            const { pagination } = this.appStore
            this.appStore.getData(pagination)
            Notify.success('删除成功')
          } else {
            Notify.success('删除失败，请重试')
          }
        })
        // this.store.removeData(item.id).then(res => {
        //   if (res.code === 200) {
        //     Notify.success('删除成功')
        //     this.getData()
        //   } else {
        //     Notify.success('删除失败，请重试')
        //   }
        // })
      },
    })
  }

  // 分页
  handlePaginationChange(value) {
    const { pagination } = this.appStore
    const newPaging = { ...pagination, current: value }
    this.appStore.pagination = newPaging
    this.appStore.getData(newPaging)
  }

  // updateList = () => {
  //   const { pagination } = this.state
  //   this.getData(pagination)
  // }

  showDeploy = () => {
    const { match, module, projectStore, trigger, rootStore } = this.props
    debugger
    return this.props.trigger('app.deploy', {
      module,
      namespace: match.params.namespace,
      cluster: match.params.cluster,
      workspace: get(projectStore, 'detail.workspace'),
      routing: this.props.rootStore.routing,
      trigger,
      projectDetail: projectStore.detail,
      rootStore,
      crdAppStore: this.crdAppStore,
      // updateList: this.updateList,
      appStore: this.appStore,
    })
  }

  // 应用状态变化
  radioChange(type, e) {
    const { value } = e.target
    const { pagination } = this.appStore
    const newPaging = {
      ...pagination,
      [type]: value,
    }
    this.appStore.getData(newPaging)
  }

  render() {
    // const { templates } = this.store
    const { tags } = this.state
    const { lists, pagination } = this.appStore

    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.appStore.getData({
        ...pagination,
        ...values,
      })
    }
    const onReset = () => {
      this.form.current.setFieldsValue({
        status: '',
        type: '',
        name: '',
        tagId: [],
      })
      const newPaging = {
        ...pagination,
        current: 1,
        pageSize: 10,
      }
      // this.appStore.pagination = newPaging
      this.appStore.getData(newPaging)
    }

    return (
      <>
        <Banner
          title="应用"
          description="容器平台提供全生命周期的应用管理，可以上传或者创建新的应用模板，并且快速部署它们。"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle" className="margin-b12">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="应用状态" name="status">
                    <Radio.Group
                      defaultValue={''}
                      onChange={this.radioChange.bind(this, 'status')}
                    >
                      <Radio value={''}>全部</Radio>
                      <Radio value={1}>正常</Radio>
                      <Radio value={0}>异常</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="应用分类" name="type">
                    <Radio.Group
                      defaultValue={''}
                      onChange={this.radioChange.bind(this, 'type')}
                    >
                      <Radio value={''}>全部</Radio>
                      <Radio value={0}>模板应用</Radio>
                      <Radio value={1}>自制应用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={this.showDeploy}>
                    新增应用
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between">
              <Row>
                <Col>
                  <Form.Item
                    label="应用名称"
                    name="name"
                    style={{ width: '280px', marginRight: '10px' }}
                  >
                    <Input placeholder="请输入筛选的名称" />
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: '15px' }}>
                  <Form.Item label="应用标签" name="tagId">
                    <Select
                      mode="multiple"
                      style={{
                        width: '220px',
                        borderRadius: '2px',
                        border: '1px solid #d9d9d9',
                      }}
                      placeholder="请选择筛选的标签"
                      // defaultValue={['a10', 'c12']}
                      // onChange={handleChange}
                    >
                      {tags &&
                        tags.length > 0 &&
                        tags.map(i => (
                          <Option key={i.id} value={i.id}>
                            {i.name}
                          </Option>
                        ))}
                    </Select>
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
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={lists}
          pagination={pagination}
        />
      </>
    )
  }
}
