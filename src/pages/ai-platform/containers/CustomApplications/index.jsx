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
  TreeSelect,
  Modal,
} from 'antd'

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

import { Button as KButton, Notify } from '@kube-design/components'
// import { inject } from 'mobx-react'
import { Status } from 'components/Base'

import OpAppStore from 'stores/openpitrix/application'
import CRDAppStore from 'stores/application/crd'
import ApplicationStore from 'stores/ai-platform/application'
import { withProjectList } from 'components/HOCs/withList'
import { get } from 'lodash'
import { getAppTags, removeApp, updateAppList, updateApp } from 'api/platform'
import dayjs from 'dayjs'
import { TAGS_COLORS } from 'utils/constants'
import GroupStore from 'stores/ai-platform/group'
import styles from './index.scss'
import EditModal from './editForm'

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
    this.homeStore = this.props.homeStore
    this.groupStore = new GroupStore()
    this.state = {
      tags: [],
      show: false,
      item: null,
    }
    this.form = React.createRef()
    this.groupStore.getData()
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
    const { namespace, workspace } = this.props.match.params
    getAppTags().then(res => {
      const { code, data } = res
      if (code === 200) {
        this.setState({
          tags: data,
        })
      }
    })
    updateAppList({ namespace, workspace })
    this.appStore.getData()
    this.ctrl = setInterval(async () => {
      await updateAppList({ namespace, workspace })
      await this.appStore.getData()
    }, 15 * 1000)
  }

  componentWillUnmount() {
    this.ctrl && clearInterval(this.ctrl)
  }

  getColumns = () => {
    const cols = [
      {
        title: '??????',
        dataIndex: 'name',
        width: '130px',
      },
      {
        title: '??????',
        dataIndex: 'status',
        width: '120px',
        // eslint-disable-next-line no-unused-vars
        render: (status, record) => {
          const label = status === 1 ? 'Running' : 'Warning'
          return <Status type={label} name={t(label)} />
        },
      },
      {
        title: '??????',
        dataIndex: 'type',
        render: type =>
          type === 0 ? (
            <Tag color="processing">??????</Tag>
          ) : (
            <Tag color="success">??????</Tag>
          ),
      },
      {
        title: '??????',
        dataIndex: 'app_labels',
        width: '220px',
        render: _ => {
          return _.map(item => {
            const { tags } = this.state
            const t =
              tags.findIndex(i => i.id === item.tagId) % TAGS_COLORS.length
            return (
              <Tag key={item.tagId} color={TAGS_COLORS[t]}>
                {item.label.name}
              </Tag>
            )
          })
        },
      },
      // {
      //   title: '??????',
      //   dataIndex: 'appId',
      // },
      {
        title: '????????????',
        dataIndex: 'deployments',
        width: '80px',
        align: 'center',
      },
      {
        title: '??????',
        dataIndex: 'services',
        align: 'center',
      },
      {
        title: '????????????',
        dataIndex: 'created',
        width: '210px',
        render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '??????',
        dataIndex: 'more',
        fixed: 'right',
        width: '210px',
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
              ??????
            </Button>
            <Button
              type="text"
              size="small"
              style={{ color: '#1890ff' }}
              icon={<EditOutlined />}
              onClick={() => this.handleEdit(record)}
            >
              ??????
            </Button>
            {/* <Popover content="??????" title=""> */}
            <Button
              type="text"
              size="small"
              style={{ color: '#ff7875' }}
              icon={<DeleteOutlined />}
              onClick={() => this.handleDelete(record)}
            >
              ??????
            </Button>
            {/* </Popover> */}
          </div>
        ),
      },
    ]
    if (this.homeStore.isAdmin) {
      cols.unshift(
        ...[
          {
            title: '??????',
            dataIndex: 'user',
            width: '140px',
            ellipsis: true,
            render: val => val?.name || '',
          },
          {
            title: '??????',
            dataIndex: 'user',
            width: '140px',
            render: val => {
              const groups = get(val, 'users_groups')
              return groups
                ? groups.map(i => {
                    const name = get(i, 'group.name')
                    return name ? <Tag color="processing">{name}</Tag> : '-'
                  })
                : ''
            },
          },
        ]
      )
    }
    return cols
  }

  handleEdit(record) {
    this.setState({ show: true, item: record })
  }

  // ??????????????????
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

  // ????????????
  handleDelete = record => {
    Modal.confirm({
      title: `??????????????????${record.name}??????`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '??????',
      cancelText: '??????',
      onOk: async () => {
        removeApp(record.appId).then(res => {
          const { code } = res
          if (code === 200) {
            const { pagination, lists } = this.appStore
            const { current } = pagination
            if (lists.length && lists.length === 1) {
              this.appStore.pagination = {
                ...pagination,
                current: current - 1 < 1 ? 1 : current - 1,
              }
            }
            this.appStore.getData()
            Notify.success('????????????')
          } else {
            Notify.success('????????????????????????')
          }
        })
        // this.store.removeData(item.id).then(res => {
        //   if (res.code === 200) {
        //     Notify.success('????????????')
        //     this.getData()
        //   } else {
        //     Notify.success('????????????????????????')
        //   }
        // })
      },
    })
  }

  // ??????
  // handlePaginationChange(value) {
  //   const { pagination } = this.appStore
  //   const newPaging = { ...pagination, current: value }
  //   this.appStore.pagination = newPaging
  //   this.appStore.getData(newPaging)
  // }

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

  // ??????????????????
  radioChange(type, e) {
    const formValues = this.form.current.getFieldsValue()
    const { value } = e.target
    const { pagination } = this.appStore
    const newPaging = {
      ...pagination,
      ...formValues,
      [type]: value,
    }
    this.appStore.pagination = newPaging
    this.appStore.getData(newPaging)
  }

  render() {
    // const { templates } = this.store
    const { tags, show, item } = this.state
    const { lists, pagination } = this.appStore

    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      const newPaging = {
        ...pagination,
        ...values,
      }
      this.appStore.pagination = newPaging
      this.appStore.getData(newPaging)
    }

    const onReset = () => {
      this.form.current.setFieldsValue({
        status: '',
        type: '',
        name: '',
        tagId: [],
        pid: null,
      })
      const newPaging = {
        ...pagination,
        current: 1,
        type: '',
        status: '',
        name: '',
        pageSize: 10,
        total: 0,
        tagId: '',
        pid: null,
      }
      this.appStore.pagination = newPaging
      this.appStore.getData(newPaging)
    }

    const onCancel = () => {
      this.setState({ show: false })
    }

    // ????????????????????????
    const onSubmit = async res => {
      const { code } = await updateApp(res)
      // const { code } = await this.store.editData(res)
      code === 200 ? Notify.success('????????????') : Notify.error('????????????')
      this.setState({ show: false })
      this.appStore.getData()
    }

    // const getNewData = () => {
    //   return [
    //     {
    //       key: '-1',
    //       id: -1,
    //       name: '???',
    //     },
    //     ...this.groupStore.treeData,
    //   ]
    // }

    const onTreeChange = val => {
      this.appStore.pagination.pid = val
    }

    // ????????????
    const handleChange = val => {
      if (!val || val.length === 0) {
        this.appStore.pagination = {
          ...this.appStore.pagination,
          tagId: '',
        }
        this.appStore.getData()
      }
    }

    return (
      <>
        <Banner
          title="??????"
          description="???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row justify="space-between" align="middle" className="margin-b12">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="????????????" name="status">
                    <Radio.Group
                      defaultValue={''}
                      onChange={this.radioChange.bind(this, 'status')}
                    >
                      <Radio value={''}>??????</Radio>
                      <Radio value={1}>?????????</Radio>
                      <Radio value={0}>??????</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="??????" name="type">
                    <Radio.Group
                      defaultValue={''}
                      onChange={this.radioChange.bind(this, 'type')}
                    >
                      <Radio value={''}>??????</Radio>
                      <Radio value={0}>??????</Radio>
                      <Radio value={1}>??????</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton type="control" onClick={this.showDeploy}>
                    ??????
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between">
              <Row>
                {this.homeStore.isAdmin && (
                  <Col>
                    <Form.Item label="????????????" name="pid">
                      <TreeSelect
                        treeLine={{ showLeafIcon: false }}
                        // showSearch
                        style={{
                          width: '220px',
                          border: '1px solid #d9d9d9',
                          height: '32px',
                          marginRight: '10px',
                          overflow: 'hidden',
                        }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="???????????????"
                        allowClear
                        treeDefaultExpandAll
                        // initialValues={-1}
                        onChange={onTreeChange}
                        fieldNames={{ label: 'name', value: 'id', key: 'id' }}
                        treeData={this.groupStore.treeData}
                      >
                        {/* <TreeNode value="-1" title="???"></TreeNode> */}
                      </TreeSelect>
                    </Form.Item>
                  </Col>
                )}
                <Col>
                  <Form.Item
                    label="??????"
                    name="name"
                    style={{ width: '280px', marginRight: '10px' }}
                  >
                    <Input placeholder="????????????????????????" />
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: '15px' }}>
                  <Form.Item label="??????" name="tagId">
                    <Select
                      mode="multiple"
                      style={{
                        width: '220px',
                        borderRadius: '2px',
                        border: '1px solid #d9d9d9',
                      }}
                      placeholder="????????????????????????"
                      // defaultValue={['a10', 'c12']}
                      onChange={handleChange}
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
                      ??????
                    </KButton>
                    <KButton type="default" onClick={onReset}>
                      ??????
                    </KButton>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Form>
        </div>
        <Table
          key="appId"
          scroll={{ x: 1400 }}
          columns={this.getColumns()}
          dataSource={lists}
          pagination={pagination}
        />
        <EditModal
          show={show}
          onCancel={onCancel}
          onSubmit={onSubmit}
          lists={tags}
          item={item}
        ></EditModal>
      </>
    )
  }
}
