/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react'
import Banner from 'components/Cards/Banner'
import { Modal } from 'components/Base'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import {
  Level,
  LevelItem,
  LevelLeft,
  LevelRight,
  Button as KButton,
  InputSearch,
  Pagination,
  Notify,
} from '@kube-design/components'
import { Table, Switch, Button, Tag } from 'antd'
import MenuModal from 'components/Modals/MenuCreate'

import UserStore from 'stores/user'
import RoleStore from 'stores/role'
import * as Icons from '@ant-design/icons'
import { getMenus, addMenu, removeMenu, editMenu } from 'api/users'
import { getTreeData } from 'utils/menu'
import DeleteModal from 'components/Modals/Delete'
import styles from './index.scss'

@withProjectList({
  store: new UserStore(),
  module: 'users',
  authKey: 'members',
  name: 'Project Member',
  rowKey: 'username',
})
export default class Members extends React.Component {
  roleStore = new RoleStore()

  constructor(props) {
    super(props)
    this.state = {
      checkStrictly: false,
      data: [],
    }
  }

  async getData() {
    const { status, data } = await getMenus()
    if (status === 200) {
      this.setState({
        data: getTreeData(data.data, null),
      })
    }
  }

  async componentDidMount() {
    this.getData()
  }

  get tips() {
    return [
      {
        title: '创建菜单',
        description:
          '新建菜单，可以编辑菜单的名称、路径、路由，类型默认为菜单（还可以设置成目录，即有子菜单层级）、链接（外部链接跳转）。',
      },
      {
        title: '菜单编辑',
        description: '可以通过编辑功能来调整菜单的属性，设置菜单的隐藏与显示',
      },
    ]
  }

  get tableColumns() {
    return [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '菜单名称',
        dataIndex: 'name',
        render: value => t(value),
      },
      {
        title: '菜单类型',
        dataIndex: 'type',
        render: (val, record) => {
          switch (val) {
            case 0:
              return <Tag color="processing">菜单</Tag>
            case 1:
              return <Tag color="success">目录</Tag>
            case 2:
              return <Tag color="error">链接</Tag>
            default:
              return <Tag color="processing">菜单</Tag>
          }
        },
        align: 'center',
      },
      {
        title: '路径',
        dataIndex: 'path',
        width: '25%',
        ellipsis: true,
      },
      {
        title: '菜单路由',
        dataIndex: 'route',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        align: 'center',
      },
      {
        title: '是否启用',
        dataIndex: 'status',
        align: 'center',
        render: status => {
          return <Switch defaultChecked={status === 0} />
        },
      },
      {
        title: '操作菜单',
        render: (text, record) => (
          <>
            <Button
              type="text"
              size="small"
              style={{ color: '#096dd9' }}
              onClick={() => this.handleEdit(record)}
            >
              <Icons.EditOutlined />
              编辑
            </Button>
            <Button
              type="text"
              size="small"
              danger
              onClick={() => this.handleRemove(record)}
            >
              <Icons.ExportOutlined />
              删除
            </Button>
          </>
        ),
      },
    ]
  }

  handleEdit(record) {
    console.log(
      '🚀 ~ file: index.jsx ~ line 125 ~ Members ~ handleEdit ~ record',
      record
    )
  }

  handleRemove(item) {
    const modal = Modal.open({
      onOk: async () => {
        // store.delete(detail).then(() => {
        const res = await removeMenu({
          id: item.id,
        })
        if (res.status === 200) {
          Notify.success({ content: `删除成功` })
          this.getData()
        } else {
          Notify.error({ content: `删除失败` })
        }
        Modal.close(modal)
        // success && success()
        // })
      },
      modal: DeleteModal,
      title: '确定删除？',
      desc: `确定删除 ${t(item.name) || item.name} 的菜单吗？`,
      resource: item.name,
      // resource: ``,
      // ...props,
    })
  }

  formatData(arr) {
    arr = arr.map(item => {
      item = {
        ...item,
        title: t(item.name),
        value: item.id,
      }
      if (item.children) {
        item.children = this.formatData(item.children)
      }
      return item
    })
    return arr
  }

  handleCreateMenu() {
    let { data: treeData } = this.state
    treeData = this.formatData(treeData)
    const modal = Modal.open({
      onOk: async data => {
        try {
          const { status, data: resData } = await addMenu(data)
          if (status === 200 && resData.data.id) {
            this.getData()
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}` })
          } else {
            Notify.error({ content: `创建失败，请重新提交` })
          }
        } catch (error) {
          Modal.close(modal)
          Notify.error({ content: `服务请求异常')}` })
        }
      },
      title: '创建菜单',
      modal: MenuModal,
      formTemplate: {},
      module,
      treeData,
    })
  }

  renderNormalTitle() {
    const { hideCustom, columns } = this.props
    const { hideColumns } = this.state

    return (
      <div className={styles['table-title']}>
        <Level>
          <LevelItem>
            <InputSearch
              className={styles.search}
              // value={filters[searchType]}
              onSearch={this.handleSearch}
              placeholder="请输入名称搜索"
            />
          </LevelItem>
          <LevelRight>
            <div>
              <KButton
                type="flat"
                icon="refresh"
                onClick={this.handleRefresh}
                data-test="table-refresh"
              />
            </div>
            <KButton type="control" onClick={this.handleCreateMenu.bind(this)}>
              创建菜单
            </KButton>
          </LevelRight>
        </Level>
      </div>
    )
  }

  renderTableFooter = () => {
    const total = 10
    const page = 1
    const limit = 10

    return (
      <div className={styles['table-footer']}>
        <Level>
          <LevelLeft>{t('TOTAL_ITEMS', { num: total })}</LevelLeft>
          <LevelRight>
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onChange={this.handlePagination}
            />
          </LevelRight>
        </Level>
      </div>
    )
  }

  render() {
    const { bannerProps } = this.props
    const { checkStrictly, data } = this.state

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        )
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
    }

    return (
      <ListPage {...this.props} className={styles.wrapper}>
        <Banner
          // {...bannerProps}
          tips={this.tips}
          title="平台菜单"
          description="用于管理平台的菜单与层级结构"
        />
        <div className={styles.table}>
          {this.renderNormalTitle()}
          <Table
            rowKey="id"
            columns={this.tableColumns}
            rowSelection={{ ...rowSelection, checkStrictly }}
            dataSource={data}
            pagination={false}
          />
          {this.renderTableFooter()}
        </div>
      </ListPage>
    )
  }
}
