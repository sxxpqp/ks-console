import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon, Tag } from '@kube-design/components'
import { Panel, Status } from 'components/Base'
import { Row, Button, Table } from 'antd'

import { getLocalTime } from 'utils'
import { Link } from 'react-router-dom'
// import {
//   EyeOutlined,
// } from '@ant-design/icons'
import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'
import { updateAlertMessage } from 'api/platform'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class Alert extends Component {
  renderEmpty() {
    return (
      <div className={styles.empty}>
        <Icon name="backup" size={32} />
        <div>{t('No Relevant Data')}</div>
      </div>
    )
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get prefix() {
    const { workspace, cluster, namespace } = globals.user.ai
    return `/${workspace}/clusters/${cluster}/projects/${namespace}`
  }

  setRead(record) {
    updateAlertMessage({ id: record.id })
  }

  getColumns = () => [
    {
      title: '告警条件',
      dataIndex: 'msg',
      width: '35%',
      render: (val, record) => {
        const meta = JSON.parse(record.meta)
        return (
          <Link to={`${this.prefix}/alert-rules/${meta.ruleName}/messages`}>
            <span onClick={() => this.setRead(record)}>
              {val.replace(/部署/g, '')}
            </span>
          </Link>
        )
      },
      // ellipsis: true,
      // render: val => {
      //   return (
      //     <Popover content={val} title="">
      //       {val}
      //     </Popover>
      //   )
      // },
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
          <Link to={`${this.prefix}/alert-rules/${meta.ruleName}`}>{val}</Link>
        )
      },
    },
    {
      title: '告警资源',
      dataIndex: 'app',
      render: app => {
        return app.split(':')[1]
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
  ]

  handleClick = () => {
    const { workspace, namespace, cluster } = globals.user.ai
    this.routing.push(
      `/${workspace}/clusters/${cluster}/projects/${namespace}/alerts`
    )
  }

  render() {
    const { store } = this.props
    return (
      <Panel title="告警信息">
        {store.alertMsgs.length ? (
          <>
            <div className="margin-b12">
              <Table
                id="appId"
                dataSource={store.alertMsgs}
                columns={this.getColumns()}
                pagination={store.alertPagination}
              />
            </div>
            <Row justify="end">
              <Button type="link" onClick={() => this.handleClick()}>
                查看更多
              </Button>
            </Row>
          </>
        ) : (
          this.renderEmpty()
        )}
      </Panel>
    )
  }
}
