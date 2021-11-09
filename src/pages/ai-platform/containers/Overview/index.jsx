import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column, Button as KButton } from '@kube-design/components'
import { get } from 'lodash'
import { Panel } from 'components/Base'
// import BaseInfo from './BaseInfo'
import { Statistic, Row, Col, Button } from 'antd'
// import { toJS } from 'mobx'
import {
  // CloudServerOutlined,
  AlertOutlined,
  // FundProjectionScreenOutlined,
  // ApiOutlined,
  DesktopOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  DatabaseOutlined,
  AppstoreAddOutlined,
  BarsOutlined,
  ChromeOutlined,
  // ExclamationCircleOutlined,
  // AreaChartOutlined,
} from '@ant-design/icons'

import OverviewStore from 'stores/overview'
import ProjectMonitorStore from 'stores/monitoring/project'

// import ApplicationsList from './ApplicationsList'
// import Applications from './Applications'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts'
import ResourceUsage from './ResourceUsage'
import UsageRanking from './UsageRanking'

// import Help from './Help'
// import Quota from './Quota'
// import LimitRange from './LimitRange'

import styles from './index.scss'

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

  chartsRender() {
    const data = [
      {
        name: '节点1',
        cpu: 4000,
        mem: 2400,
        disk: 2400,
        gpu: 2400,
      },
      {
        name: '节点2',
        cpu: 3000,
        mem: 1398,
        disk: 2210,
        gpu: 2321,
      },
      {
        name: '节点3',
        cpu: 2000,
        mem: 9800,
        disk: 2210,
        gpu: 2321,
      },
      {
        name: '节点4',
        cpu: 2000,
        mem: 9800,
        disk: 2210,
        gpu: 2321,
      },
      {
        name: '节点5',
        cpu: 2000,
        mem: 9800,
        disk: 2210,
        gpu: 2321,
      },
    ]

    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          width={500}
          // height={300}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cpu" fill="#5272cd" name="cpu" />
          <Bar dataKey="mem" fill="#faad14" name="内存" />
          <Bar dataKey="disk" fill="#82ca9d" name="磁盘" />
          <Bar dataKey="gpu" fill="#f26e68" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  pieChartsRender() {
    const data = [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
    ]

    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    return (
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
        />
      </PieChart>
    )
  }

  renderResource() {
    return (
      <Panel title="资源情况">
        <Row>
          <Col span={6}>
            <Statistic
              title="CPU"
              value={'12 vCore'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="内存"
              value={'128 GiB'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="磁盘"
              value={'48 GiB'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="GPU"
              value={'4 vCore'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
        </Row>
        <Row justify="end">
          <KButton type={'control'} onClick={() => this.handleClick('apply')}>
            快速申请
          </KButton>
        </Row>
      </Panel>
    )
  }

  renderPlatform() {
    return (
      <Panel title="平台总览">
        <Row>
          <Col span={8}>
            <Statistic
              title="节点总数/正常"
              value={'12/3'}
              valueStyle={{ color: '#333' }}
              prefix={<DesktopOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="运行容器/异常容器"
              value={'48/2'}
              valueStyle={{ color: '#333' }}
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="告警统计/已读"
              value={'4/0'}
              valueStyle={{ color: '#333' }}
              prefix={<AlertOutlined />}
            />
          </Col>
        </Row>
      </Panel>
    )
  }

  renderAlert() {
    return (
      <Panel title="告警信息">
        123
        <Row justify="end">
          <Button type="link" onClick={() => this.handleClick('more')}>
            查看更多
          </Button>
        </Row>
      </Panel>
    )
  }

  renderQuick() {
    return (
      <Panel title="快捷访问">
        <Row className="margin-b12">
          <Col span={6}>
            <div className={styles.icon}>
              <div>
                <CloudServerOutlined style={{ fontSize: '24px' }} />
              </div>
              <span>申请资源</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <BarsOutlined style={{ fontSize: '24px' }} />
              <span>申请历史</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <AppstoreAddOutlined style={{ fontSize: '24px' }} />
              <span>创建应用</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <AppstoreOutlined style={{ fontSize: '24px' }} />
              <span>应用管理</span>
            </div>
          </Col>
        </Row>
        <Row className="margin-b12">
          <Col span={6}>
            <div className={styles.icon}>
              <AlertOutlined style={{ fontSize: '24px' }} />
              <span>告警信息</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <DatabaseOutlined style={{ fontSize: '24px' }} />
              <span>资源详情</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <ApartmentOutlined style={{ fontSize: '24px' }} />
              <span>节点管理</span>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.icon}>
              <ChromeOutlined style={{ fontSize: '24px' }} />
              <span>镜像管理</span>
            </div>
          </Col>
        </Row>
      </Panel>
    )
  }

  render() {
    // const { detail } = this.project
    // const { quota = {}, status = {} } = toJS(this.overviewStore.resource)
    // const { quota = {}, status = {} } = toJS(this.overviewStore.resource)
    // const used = quota.used || {}

    return (
      <div>
        <div className="h3 margin-b12">你好！{globals.user.username}</div>
        <Columns>
          <Column className="is-8">
            {this.renderResource()}
            {this.renderPlatform()}
            <Panel title="节点资源统计">
              <div>{this.chartsRender()}</div>
              <Row justify="end">
                <Button type="link" onClick={() => this.handleClick('more')}>
                  查看更多
                </Button>
              </Row>
            </Panel>
            <Panel title="运行容器统计">
              <Row>
                <Col span={8}>{this.pieChartsRender()}</Col>
                <Col span={16}>
                  123
                  <Row justify="end">
                    <Button
                      type="link"
                      onClick={() => this.handleClick('more')}
                    >
                      查看更多
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Panel>
            {this.renderAlert()}
          </Column>
          <Column className="is-4">
            {this.renderQuick()}
            <UsageRanking match={this.props.match} />
            <ResourceUsage match={this.props.match} />
          </Column>
        </Columns>
      </div>
    )
  }
}
