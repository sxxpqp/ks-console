import React from 'react'
// import { get } from 'lodash'
import Banner from 'components/Cards/Banner'
import withList from 'components/HOCs/withList'
import { Status } from 'components/Base'
import { Tag, Button as KButton } from '@kube-design/components'

import { getLocalTime } from 'utils'
import { Link } from 'react-router-dom'
import { Table, Row, Col, Input, Form, Radio } from 'antd'
import MessageStore from 'stores/alerting/message'
import ApplicationStore from 'stores/ai-platform/application'
import { MODULE_KIND_MAP } from 'utils/constants'
import { updateAlertMessage } from 'api/platform'

// import {
//   EyeOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from '@ant-design/icons'

import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'
// import styles from './index.scss'
import { getAlertingResource } from 'utils/alerting'

@withList({
  store: new MessageStore(),
  module: 'alerts',
  name: 'Alerting Message',
})
export default class AlertMsg extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      item: null,
      show: false,
      isEdit: false,
      params: {
        gid: '',
        status: '',
        name: '',
        username: '',
      },
      user: null,
    }
    this.form = React.createRef()
    this.appStore = new ApplicationStore()
    this.appStore.getAlertMsg()
  }

  // get canViewRoles() {
  //   return globals.app.hasPermission({
  //     ...this.props.match.params,
  //     project: this.props.match.params.namespace,
  //     module: 'roles',
  //     action: 'view',
  //   })
  // }

  get prefix() {
    const { workspace, cluster, namespace } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/projects/${namespace}`
  }

  componentDidMount() {
    // this.getData()
  }

  setRead(record) {
    updateAlertMessage({ id: record.id })
  }

  getColumns = () => [
    {
      title: '告警条件',
      dataIndex: 'msg',
      width: '25%',
      render: (val, record) => {
        const meta = JSON.parse(record.meta)
        // updateAlertMessage(record.id)
        return (
          <Link to={`${this.prefix}/alert-rules/${meta.ruleName}/messages`}>
            <span onClick={() => this.setRead(record)}>
              {val.replace(/部署/g, '')}
            </span>
          </Link>
        )
      },
    },
    {
      title: '告警状态',
      dataIndex: 'status',
      width: '100px',
      align: 'center',
      render: state => (
        <Status
          type={state}
          name={t(`ALERT_RULE_${state.toUpperCase()}`, {
            defaultValue: state,
          })}
        />
      ),
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      align: 'center',
      render: severity => {
        const level = SEVERITY_LEVEL.find(item => item.value === severity)
        if (level) {
          return <Tag type={level.type}>{t(level.label)}</Tag>
        }
        return <Tag>{severity}</Tag>
      },
    },
    {
      title: '告警策略',
      dataIndex: 'rule',
      render: (val, record) => {
        const meta = JSON.parse(record.meta)
        return (
          <Link
            to={
              this.state.type === 'builtin'
                ? `${this.prefix}/alert-rules/builtin/${meta.ruleId}`
                : `${this.prefix}/alert-rules/${meta.ruleName}`
            }
          >
            {val}
          </Link>
        )
      },
    },
    {
      title: '告警资源',
      dataIndex: 'app',
      render: (val, record) => {
        const meta = JSON.parse(record.meta)
        const { module, name } = getAlertingResource(meta.labels)
        if (!module) {
          return '-'
        }

        return (
          <Link
            to={{
              pathname: `${this.prefix}/${module}/${name}`,
              state: {
                prevPath: this.props.rootStore.routing.location.pathname,
              },
            }}
          >
            {t(MODULE_KIND_MAP[module])}: {name}
          </Link>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      render: login_time => (
        <p>
          {login_time
            ? getLocalTime(login_time).format('YYYY-MM-DD HH:mm:ss')
            : t('Not logged in yet')}
        </p>
      ),
    },
    {
      title: '是否已读',
      dataIndex: 'read',
      render: read => (read ? '已读' : '未读'),
    },
    // {
    //   title: '操作',
    //   dataIndex: 'more',
    //   fixed: 'right',
    //   // eslint-disable-next-line no-unused-vars
    //   render: (_, item) => (
    //     <div className={styles.btns}>
    //       <Button
    //         type="text"
    //         size="small"
    //         style={{ color: '#1890ff' }}
    //         icon={<EyeOutlined />}
    //         // onClick={}
    //       >
    //         详情
    //       </Button>
    //     </div>
    //   ),
    // },
  ]

  radioChange(e) {
    // eslint-disable-next-line no-console
    const { value } = e.target
    this.appStore.alertPagination = {
      ...this.appStore.alertPagination,
      read: value,
    }
    this.appStore.getAlertMsg()
  }

  render() {
    const { alertMsgs: data } = this.appStore

    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.appStore.alertPagination = {
        ...this.appStore.alertPagination,
        ...values,
      }
      this.appStore.getAlertMsg()
    }

    const onReset = () => {
      this.form.current.resetFields()
      this.appStore.alertPagination = {
        ...this.appStore.alertPagination,
        msg: '',
        status: '',
        level: '',
        read: '',
        rule: '',
        current: 1,
        pageSize: 10,
        total: 0,
      }
      this.appStore.getAlertMsg()
    }

    return (
      <div>
        <Banner
          title="告警消息"
          description={
            '告警消息记录了在工作负载级别的告警策略中，所有已发出的满足告警规则的告警信息。'
          }
        />
        <div className="table-title">
          <Form ref={this.form}>
            <Row align="middle">
              <Col style={{ marginRight: '15px' }}>
                <Form.Item label="告警条件" name="msg">
                  <Input placeholder="请输入告警条件" />
                </Form.Item>
              </Col>
              <Col style={{ marginRight: '15px' }}>
                <Form.Item label="告警策略" name="rule">
                  <Input placeholder="请输入告警策略" />
                </Form.Item>
              </Col>
              <Col style={{ marginRight: '15px' }}>
                <Form.Item label="是否已读" name="read">
                  <Radio.Group defaultValue={''}>
                    <Radio value={''}>全部</Radio>
                    <Radio value={0}>未读</Radio>
                    <Radio value={1}>已读</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col style={{ marginRight: '15px' }}>
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
          </Form>
        </div>
        <Table
          scroll={{ x: 1400 }}
          columns={this.getColumns()}
          dataSource={data}
        />
      </div>
    )
  }
}
