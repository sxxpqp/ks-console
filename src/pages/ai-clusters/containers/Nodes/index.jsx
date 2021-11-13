import React from 'react'
import Banner from 'components/Cards/Banner'
import {
  Popover,
  Table,
  Row,
  Col,
  Input,
  Form,
  Button,
  Radio,
  TreeSelect,
} from 'antd'

import {
  EyeOutlined,
  EditOutlined,
  // DeleteOutlined,
  // UserOutlined,
} from '@ant-design/icons'

import { getNodes, editNodes } from 'api/platform'
import { Button as KButton, Icon, Notify } from '@kube-design/components'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import { Text, Status } from 'components/Base'
import GroupStore from 'stores/ai-platform/group'
import { Link } from 'react-router-dom'
import styles from './index.scss'
import EditForm from './form'

@observer
export default class Nodes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      status: -1,
      pagination: {
        // pageSizeOptions: [10, 20, 50, 100],
        // showSizeChanger: true,
        // showQuickJumper: true,
        current: 1,
        pageSize: 10,
        total: 0,
      },
      show: false,
      item: null,
      loading: false,
    }
    this.groupStore = new GroupStore()
    this.groupStore.getData()
    this.form = React.createRef()
    this.getData()
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  getData(params) {
    getNodes({ ...params, ...this.state.pagination })
      .then(res => {
        if (res.code === 200) {
          this.setState({
            data: res.data,
            pagination: {
              ...this.state.pagination,
              total: res.total,
            },
          })
          this.setState({
            loading: false,
          })
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {
        this.setState({
          loading: false,
        })
      })
  }

  getColumns = () => [
    {
      title: '名称',
      dataIndex: 'name',
      render: (_, record) => {
        return record.name ? record.name : record.node
      },
    },
    {
      title: '组织',
      dataIndex: 'group',
      render: (_, record) => {
        return record.groups_node
          ? get(record, 'groups_node.group.name') || '未分配'
          : '未分配'
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => {
        // console.log('🚀 ~ file: index.jsx ~ line 95 ~ Nodes ~ val', val)
        // switch (val) {
        //   case 'Running':
        //     return <Tag color="success">正常</Tag>
        //   case 'Warnning':
        //     return <Tag color="error">异常</Tag>
        //   default:
        //     return <Tag color="success">未知</Tag>
        // }
        return (
          <Status type={val} name={t(`NODE_STATUS_${val.toUpperCase()}`)} />
        )
      },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: '15%',
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      width: '10%',
      sorter: (a, b) => {
        const aRate = parseFloat(a.cpu_used) / parseFloat(a.cpu)
        const bRate = parseFloat(b.cpu_used) / parseFloat(b.cpu)
        return aRate - bRate
      },
      render: (_, record) => {
        const rate = Math.round(
          (parseFloat(record.cpu_used) / parseFloat(record.cpu)) * 100
        )
        return (
          <Text
            title={
              <div className={styles.resource}>
                <span>{`${rate}%`}</span>
                {rate >= 90 && <Icon name="exclamation" />}
              </div>
            }
            description={`${record.cpu_used}/${parseInt(record.cpu, 10)} Core`}
          />
        )
      },
    },
    {
      title: '内存',
      dataIndex: 'cpu',
      width: '10%',
      sorter: (a, b) => {
        const aRate = parseFloat(a.mem_used) / parseFloat(a.mem)
        const bRate = parseFloat(b.mem_used) / parseFloat(b.mem)
        return aRate - bRate
      },
      render: (_, record) => {
        const rate = Math.round(
          (parseFloat(record.mem_used) / parseFloat(record.mem)) * 100
        )
        return (
          <Text
            title={
              <div className={styles.resource}>
                <span>{`${rate}%`}</span>
                {rate >= 90 && <Icon name="exclamation" />}
              </div>
            }
            description={`${record.mem_used}/${record.mem} Gi`}
          />
        )
      },
    },
    {
      title: '磁盘',
      dataIndex: 'disk',
      width: '10%',
      render: (_, record) => {
        const rate = Math.round(
          (parseFloat(record.disk_used) / parseFloat(record.disk)) * 100
        )
        return (
          <Text
            title={
              <div className={styles.resource}>
                <span>{`${rate}%`}</span>
                {rate >= 90 && <Icon name="exclamation" />}
              </div>
            }
            description={`${record.disk_used}/${record.disk} GB`}
          />
        )
      },
    },
    {
      title: 'GPU',
      dataIndex: 'gpu',
      width: '10%',
      render: (_, record) => {
        const rate = parseFloat(record.gpu)
          ? Math.round(
              (parseFloat(record.gpu_used) / parseFloat(record.gpu)) * 100
            )
          : 0
        return (
          <Text
            title={
              <div className={styles.resource}>
                <span>{`${rate}%`}</span>
                {rate >= 90 && <Icon name="exclamation" />}
              </div>
            }
            description={`${record.gpu_used}/${record.gpu} Core`}
          />
        )
      },
    },
    // {
    //   title: 'GPU',
    //   dataIndex: 'gpu',
    //   width: '5%',
    // },
    {
      title: '容器组',
      dataIndex: 'pod',
      width: '10%',
      render: (_, record) => {
        const rate = Math.round(
          (parseFloat(record.pod_used) / parseFloat(record.pod)) * 100
        )
        return (
          <Text
            title={
              <div className={styles.resource}>
                <span>{`${rate}%`}</span>
                {rate >= 90 && <Icon name="exclamation" />}
              </div>
            }
            description={`${record.pod_used}/${record.pod}`}
          />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'more',
      width: '10%',
      // eslint-disable-next-line no-unused-vars
      render: (_, record) => (
        <div className={styles.btns}>
          <Popover content="查看详情" title="">
            <Link to={`/clusters/${this.cluster}/nodes/${record.node}/status`}>
              <Button
                type="text"
                size="small"
                style={{ color: '#096dd9' }}
                icon={<EyeOutlined />}
                // onClick={}
              ></Button>
            </Link>
          </Popover>
          <Popover content="编辑" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#52c41a' }}
              icon={<EditOutlined />}
              onClick={this.handleEdit.bind(this, record)}
            ></Button>
          </Popover>
        </div>
      ),
    },
  ]

  handleEdit(item) {
    item.gid = item.groups_node ? item.groups_node.gid : null
    item.name = item.name ? item.name : item.node
    this.setState({
      show: true,
      item,
    })
  }

  // eslint-disable-next-line no-unused-vars
  radioChange(e) {
    const values = this.form.current.getFieldsValue()
    this.getData(values)
  }

  resetForm = () => {
    this.form.current.resetFields()
    this.getData()
  }

  search = () => {
    this.setState({
      loading: true,
    })
    const values = this.form.current.getFieldsValue()
    this.getData(values)
  }

  handleModelCancel = () => {
    this.setState({
      show: false,
      item: null,
    })
  }

  handleModelSubmit = values => {
    editNodes(values).then(res => {
      if (res.code === 200) {
        Notify.success('更新成功')
      } else {
        Notify.error('更新失败，请重试')
      }
      this.getData()
    })
  }

  render() {
    const { data, status, pagination, show, item, loading } = this.state
    return (
      <div>
        <Banner
          title="集群节点"
          description="集群节点提供了当前集群下节点的运行状态，以及可以编辑节点"
        />
        <div className="table-title">
          <Form
            ref={this.form}
            Initializing={{
              name: '',
              pid: '',
              status: -1,
            }}
          >
            <Row justify="space-between" align="middle">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="节点名称" name="name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="组织" name="gid">
                    <TreeSelect
                      showSearch
                      style={{
                        width: '180px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '2px',
                      }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择上级部门"
                      allowClear
                      treeDefaultExpandAll
                      // initialValues={-1}
                      // onChange={onChange}
                      fieldNames={{ label: 'name', value: 'id', key: 'id' }}
                      treeData={this.groupStore.treeData}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="状态" name="status">
                    <Radio.Group
                      onChange={this.radioChange.bind(this)}
                      defaultValue={status}
                    >
                      <Radio value={-1}>全部</Radio>
                      <Radio value={0}>正常</Radio>
                      <Radio value={1}>异常</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton
                    type="control"
                    onClick={this.search}
                    loading={loading}
                  >
                    搜索
                  </KButton>
                  <KButton type="default" onClick={this.resetForm}>
                    重置刷新
                  </KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={data}
          pagination={pagination}
        />
        <EditForm
          show={show}
          item={item}
          onCancel={this.handleModelCancel}
          onSubmit={this.handleModelSubmit}
          treeData={this.groupStore.treeData}
        ></EditForm>
      </div>
    )
  }
}
