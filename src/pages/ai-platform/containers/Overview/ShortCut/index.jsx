import React, { Component } from 'react'
import {
  AlertOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  // DatabaseOutlined,
  AppstoreAddOutlined,
  BarsOutlined,
  ChromeOutlined,
} from '@ant-design/icons'
import { Panel } from 'components/Base'
import { Row, Col } from 'antd'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class ShortCut extends Component {
  render() {
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    const url = `/${workspace}/clusters/${cluster}/projects/${namespace}`

    return (
      <Panel title="快捷访问">
        {!this.props.isAdmin ? (
          <Row className="margin-b12">
            <Col span={6}>
              <Link
                className={styles.icon}
                to={{ pathname: `${url}/apply`, state: { name: 'apply' } }}
              >
                <div>
                  <CloudServerOutlined style={{ fontSize: '24px' }} />
                </div>
                <span>申请资源</span>
              </Link>
            </Col>
            <Col span={6}>
              <Link className={styles.icon} to={`${url}/applyhis`}>
                <BarsOutlined style={{ fontSize: '24px' }} />
                <span>申请历史</span>
              </Link>
            </Col>
            <Col span={6}>
              <Link className={styles.icon} to={`${url}/applications`}>
                <AppstoreOutlined style={{ fontSize: '24px' }} />
                <span>应用管理</span>
              </Link>
            </Col>
          </Row>
        ) : (
          <Row className="margin-b12">
            <Col span={6}>
              <Link
                className={styles.icon}
                to={{ pathname: `${url}/audit`, state: { name: 'audit' } }}
              >
                <AppstoreAddOutlined style={{ fontSize: '24px' }} />
                <span>应用审批</span>
              </Link>
            </Col>
            <Col span={6}>
              <Link
                className={styles.icon}
                to={{ pathname: `${url}/alerts`, state: { name: 'alerts' } }}
              >
                <AlertOutlined style={{ fontSize: '24px' }} />
                <span>告警信息</span>
              </Link>
            </Col>
            <Col span={6}>
              <Link
                className={styles.icon}
                to={{ pathname: `${url}/nodes`, state: { name: 'nodes' } }}
              >
                <ApartmentOutlined style={{ fontSize: '24px' }} />
                <span>节点管理</span>
              </Link>
            </Col>
            <Col span={6}>
              <Link
                className={styles.icon}
                to={{
                  pathname: `${url}/image-manage`,
                  state: { name: 'image-manage' },
                }}
              >
                <ChromeOutlined style={{ fontSize: '24px' }} />
                <span>镜像管理</span>
              </Link>
            </Col>
          </Row>
        )}
      </Panel>
    )
  }
}
