import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column, Button as KButton } from '@kube-design/components'
import { get } from 'lodash'
import { Panel, Card } from 'components/Base'
// import BaseInfo from './BaseInfo'
import { Statistic, Row, Col, Button } from 'antd'
import { toJS } from 'mobx'
import {
  CloudServerOutlined,
  AlertOutlined,
  FundProjectionScreenOutlined,
  ApiOutlined,
  // ExclamationCircleOutlined,
  // AreaChartOutlined,
} from '@ant-design/icons'

import OverviewStore from 'stores/overview'
import ProjectMonitorStore from 'stores/monitoring/project'

import ApplicationsList from './ApplicationsList'
// import Applications from './Applications'
import ResourceUsage from './ResourceUsage'
import UsageRanking from './UsageRanking'

// import Help from './Help'
// import Quota from './Quota'
// import LimitRange from './LimitRange'

// import styles from './index.scss'

@inject('rootStore', 'projectStore')
@observer
export default class Overview extends React.Component {
  constructor(props) {
    super(props)

    this.overviewStore = new OverviewStore()
    this.appResourceMonitorStore = new ProjectMonitorStore()

    // this.state = {
    //   apps: '',
    //   pods: '',
    //   warn: '',
    // }

    this.fetchData(this.props.match.params)
  }

  fetchData = params => {
    this.overviewStore.fetchResourceStatus(params)
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get namespace() {
    return get(this.props.match, 'params.namespace')
  }

  get project() {
    return this.props.projectStore
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'project-settings',
      ...this.props.match.params,
      project: this.namespace,
    })
  }

  handleClick = item => {
    const { workspace, namespace, cluster } = this.props.match.params
    this.routing.push(
      `/${workspace}/clusters/${cluster}/projects/${namespace}/${item}`
    )
    // this.routing.push(
    //   workspace
    //     ? `/${workspace}/clusters/${cluster}/projects/${namespace}/${routeName}`
    //     : `/clusters/${cluster}/${routeName}?namespace=${namespace}`
    // )
  }

  componentDidMount() {
    // 保存clusters信息
    this.props.rootStore.saveClusters(this.props.match.params)
  }

  render() {
    // const { detail } = this.project
    const { quota = {}, status = {} } = toJS(this.overviewStore.resource)
    const used = quota.used || {}
    return (
      <div>
        <div className="h3 margin-b12">你好！{globals.user.username}</div>
        <Columns>
          <Column className="is-8">
            <Card>
              <Row gutter={16}>
                <Col span={6} onClick={() => this.handleClick('pods')}>
                  <Statistic
                    title="实例总数"
                    value={used['count/pods']}
                    prefix={<CloudServerOutlined />}
                  />
                </Col>
                <Col span={6} onClick={() => this.handleClick('deployments')}>
                  <Statistic
                    title="工作负载"
                    value={used['count/deployments.apps']}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<FundProjectionScreenOutlined />}
                  />
                </Col>
                <Col span={6} onClick={() => this.handleClick('services')}>
                  <Statistic
                    title="对外服务"
                    value={used['count/services']}
                    valueStyle={{ color: '#237804' }}
                    prefix={<ApiOutlined />}
                  />
                </Col>
                <Col
                  span={6}
                  onClick={() =>
                    this.handleClick('deployments?status=updating')
                  }
                >
                  <Statistic
                    title="异常"
                    value={status['deployments']}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<AlertOutlined />}
                  />
                </Col>
              </Row>
            </Card>
            {/* <BaseInfo className="margin-b12" detail={detail} />
            {this.enabledActions.includes('edit') && (
              <>
                <Quota match={this.props.match} />
                <LimitRange match={this.props.match} />
              </>
            )} */}
            {globals.app.hasKSModule('openpitrix') && (
              <ApplicationsList
                match={this.props.match}
                store={this.project}
              ></ApplicationsList>
            )}
          </Column>
          <Column className="is-4">
            <UsageRanking match={this.props.match} />
            <ResourceUsage match={this.props.match} />
            <Panel title="申请资源情况">
              <Row>
                <Col span={12}>
                  <Statistic
                    title="CPU"
                    value={'12 vCore'}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="内存"
                    value={'128 GiB'}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Statistic
                    title="磁盘"
                    value={'48 GiB'}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="GPU"
                    value={'4 vCore'}
                    valueStyle={{ color: '#333' }}
                  />
                </Col>
              </Row>
              <Row justify="end">
                <KButton
                  type={'control'}
                  onClick={() => this.handleClick('apply')}
                >
                  快速申请
                </KButton>
              </Row>
            </Panel>
            <Panel title="快捷访问">
              <Row>
                <Col span={12}>
                  <Button type="link" href={globals.config.url.gitlab}>
                    代码仓库
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="link" href={globals.config.url.harbor}>
                    镜像仓库
                  </Button>
                </Col>
              </Row>
            </Panel>
          </Column>
        </Columns>
      </div>
    )
  }
}
