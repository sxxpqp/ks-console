import React from 'react'
// import { get } from 'lodash'
// import { toJS } from 'mobx'
import Banner from 'components/Cards/Banner'
import { withProjectList, ListPage } from 'components/HOCs/withList'
// import Table from 'components/Tables/List'

import { getLocalTime } from 'utils'
import { Tag, Popover, Table, Row, Col, Input, Form, Button, Radio } from 'antd'

import UserStore from 'stores/user'
import RoleStore from 'stores/role'

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { getUsers } from 'api/users'
import { Button as KButton } from '@kube-design/components'
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
      data: [],
      status: -1,
    }
  }

  // get canViewRoles() {
  //   return globals.app.hasPermission({
  //     ...this.props.match.params,
  //     project: this.props.match.params.namespace,
  //     module: 'roles',
  //     action: 'view',
  //   })
  // }

  componentDidMount() {
    getUsers().then(res => {
      if (res.code === 200) {
        this.setState({
          data: res.data,
        })
      }
    })
  }

  getColumns = () => [
    {
      title: '用户名',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '登录名',
      dataIndex: 'username',
      width: '10%',
    },
    {
      title: t('Role'),
      dataIndex: 'id',
      width: '15%',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: '5%',
      render: val => {
        switch (val) {
          case 0:
            return <Tag color="success">正常</Tag>
          case 1:
            return <Tag color="error">已禁用</Tag>
          default:
            return <Tag color="success">正常</Tag>
        }
      },
    },
    {
      title: t('Last Login Time'),
      dataIndex: 'last_login',
      width: 250,
      render: login_time => (
        <p>
          {login_time
            ? getLocalTime(login_time).format('YYYY-MM-DD HH:mm:ss')
            : t('Not logged in yet')}
        </p>
      ),
    },
    {
      title: '操作',
      dataIndex: 'more',
      isHideable: true,
      width: '20%',
      // eslint-disable-next-line no-unused-vars
      render: _ => (
        <div className={styles.btns}>
          <Popover content="查看详情" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#096dd9' }}
              icon={<EyeOutlined />}
              // onClick={}
            >
              查看详情
            </Button>
          </Popover>
          <Popover content="编辑" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#52c41a' }}
              icon={<EditOutlined />}
              // onClick={}
            >
              编辑
            </Button>
          </Popover>
          <Popover content="设置角色" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#faad14' }}
              icon={<UserOutlined />}
              // onClick={}
            >
              设置角色
            </Button>
          </Popover>
          <Popover content="删除" title="">
            <Button
              type="text"
              size="small"
              style={{ color: '#ff7875' }}
              icon={<DeleteOutlined />}
              // onClick={}
            >
              删除
            </Button>
          </Popover>
        </div>
      ),
    },
  ]

  radioChange(e) {
    // eslint-disable-next-line no-console
    console.log(
      '🚀 ~ file: index.jsx ~ line 163 ~ Members ~ radioChange ~ e',
      e
    )
  }

  render() {
    const { bannerProps } = this.props
    const { data, status } = this.state
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          {...bannerProps}
          tabs={this.tabs}
          description={t('INVITE_MEMBER_DESC')}
        />
        <div className="table-title">
          <Form>
            <Row justify="space-between" align="middle">
              <Row justify="space-around" gutter={15}>
                <Col>
                  <Form.Item label="用户名" name="username">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="登录名" name="username">
                    <Input />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="是否禁用" name="status">
                    <Radio.Group
                      onChange={this.radioChange.bind(this)}
                      value={status}
                      defaultValue={status}
                    >
                      <Radio value={-1}>全部</Radio>
                      <Radio value={0}>正常</Radio>
                      <Radio value={1}>已禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <KButton type="control">搜索</KButton>
                    <KButton type="default">清空</KButton>
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <Form.Item>
                  <KButton type="control">新增</KButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table columns={this.getColumns()} dataSource={data} />
      </ListPage>
    )
  }
}
