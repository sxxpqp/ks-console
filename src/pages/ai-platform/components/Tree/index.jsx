import React, { Component } from 'react'
import {
  Tree,
  Alert,
  Row,
  Col,
  Input,
  Card,
  Button,
  Tooltip,
  Modal,
} from 'antd'
// import { list2Tree } from 'utils/tree'
import { observer } from 'mobx-react'
import { Notify } from '@kube-design/components'
import {
  // EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  // UserOutlined,
} from '@ant-design/icons'
import { getExpanedKeys } from 'utils/tree'

const { Search } = Input

@observer
export default class TreeCustom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      value: '',
      selectedKeys: [],
      expandedKeys: [],
    }
  }

  onChange = e => {
    const { value } = e.target
    const expandedKeys = getExpanedKeys(this.props.store.treeData, value)
    this.setState({ value, expandedKeys })
  }

  // onSearch = e => {
  //   console.log('🚀 ~ file: index.jsx ~ line 45 ~ TreeCustom ~ e', e)
  // }

  onSelect = e => {
    this.setState({
      selectedKeys: e,
    })
    const id = e[0]
    // 被选中的item
    const { originData } = this.props.store
    const item = originData.find(i => i.id === id)
    if (item.pid !== -1) {
      item.pName = originData.find(i => i.id === item.pid).name
    }
    const { select } = this.props
    // const res = originData.filter(o => o.pid === id)
    // 设置被选择的item
    this.props.store.setItem(item)
    select && select(item)
    this.setState({ show: true })
  }

  // onDragEnd = e => {
  //   console.log('🚀 ~ file: index.jsx ~ line 21 ~ TreeCustom ~ value', e)
  // }

  get treeData() {
    const { value } = this.state
    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(value)
        const beforeStr = item.name.substr(0, index)
        const afterStr = item.name.substr(index + value.length)
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="search-value">{value}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          )
        if (item.children) {
          return { ...item, name, children: loop(item.children) }
        }

        return {
          ...item,
          name,
        }
      })
    // console.log(loop(this.props.store.treeData))
    return loop(this.props.store.treeData)
  }

  handleUnSelect() {
    const { select, store } = this.props
    store.setItem({
      key: '-1',
      pid: -1,
      type: 1,
    })
    select && select(null)
    this.setState({ show: false, selectedKeys: [] })
  }

  handleRemove() {
    const { selectedItem: item } = this.props.store
    Modal.confirm({
      title: `确定删除组织"${item.name}"吗？`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.store.removeData(item.id).then(res => {
          if (res.code === 200) {
            Notify.success('删除成功')
            this.setState({ show: false, selectedKeys: [] })
            const { select } = this.props
            select && select(null)
            this.getData()
          } else {
            Notify.success('删除失败，请重试')
          }
        })
      },
    })
  }

  onExpand = (keys, { expanded, node }) => {
    const { expandedKeys } = this.state

    this.setState({
      expandedKeys:
        expandedKeys.indexOf(node.id) !== -1 && !expanded
          ? expandedKeys.filter(i => i !== node.id)
          : keys,
      autoExpandParent: false,
    })
  }

  render() {
    const { show, selectedKeys, expandedKeys } = this.state
    const { canEdit } = this.props
    const flag = show && this.props.item

    return (
      <Card>
        {flag && (
          <Row style={{ marginBottom: '10px' }}>
            <Col span="24">
              <Alert
                type="info"
                showIcon
                message={
                  <>
                    <Row align="middle" justify="space-between">
                      <Button
                        type="link"
                        onClick={() => this.handleUnSelect()}
                        style={{ marginLeft: '10px' }}
                      >
                        取消选中
                      </Button>
                      {canEdit && (
                        <Row>
                          <Tooltip title="编辑">
                            <EditOutlined
                              style={{ fontSize: '18px', color: '#1890ff' }}
                              onClick={() =>
                                this.props.onEdit && this.props.onEdit()
                              }
                            />
                          </Tooltip>
                          <Tooltip title="删除">
                            <DeleteOutlined
                              style={{
                                fontSize: '18px',
                                paddingLeft: '10px',
                                color: '#ff7875',
                              }}
                              onClick={() => this.handleRemove()}
                            />
                          </Tooltip>
                        </Row>
                      )}
                    </Row>
                  </>
                }
              ></Alert>
            </Col>
          </Row>
        )}
        <Row>
          <Col span="24">
            <Search
              style={{ marginBottom: 8 }}
              placeholder="Search"
              placeholder="请输入搜索内容"
              allowClear
              // onSearch={this.onSearch}
              onChange={this.onChange}
            />
          </Col>
        </Row>
        <Tree
          showLine={{ showLeafIcon: false }}
          showIcon={false}
          switcherIcon={<DownOutlined />}
          // defaultExpandedKeys={['0-0-0']}
          onSelect={this.onSelect}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          onDragEnd={this.onDragEnd}
          fieldNames={{
            title: 'name',
            key: 'id',
            children: 'children',
          }}
          // draggable={true}
          treeData={this.treeData}
        />
      </Card>
    )
  }
}
