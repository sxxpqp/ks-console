import React from 'react'
import { observer, inject } from 'mobx-react'
import { Columns, Column } from '@kube-design/components'
import { get } from 'lodash'
import { Panel } from 'components/Base'
import { Statistic, Row, Col } from 'antd'
import {
  AlertOutlined,
  DesktopOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import GroupStore from 'stores/ai-platform/group'
import OverviewStore from 'stores/overview'
import ProjectMonitorStore from 'stores/monitoring/project'
import ReviewStore from 'stores/ai-platform/review'
import ApplicationStore from 'stores/ai-platform/application'
import ResourceUsage from './ResourceUsage'
import UsageRanking from './UsageRanking'
import MyApps from './MyApps'
import NodesOverview from './Nodes'
import ShortCut from './ShortCut'
import GroupResource from './GroupResource'
import UserResources from './UserResources'
import Alert from './Alert'

// import styles from './index.scss'

@inject('rootStore', 'projectStore', 'homeStore')
@observer
export default class Overview extends React.Component {
  constructor(props) {
    super(props)
    this.overviewStore = new OverviewStore()
    this.appResourceMonitorStore = new ProjectMonitorStore()
    this.reviewStore = new ReviewStore()
    this.groupStore = new GroupStore()
    this.appStore = new ApplicationStore()

    this.state = {
      groupRes: [],
    }

    this.fetchData(this.props.match.params)
    this.getDetail()
    this.appStore.getData({
      current: 1,
      pageSize: 999999,
    })
    this.appStore.getErrorApps()
    this.appStore.getAlertMsg()
  }

  fetchData = params => {
    this.overviewStore.fetchResourceStatus(params)
  }

  get user() {
    return this.props.homeStore.user
  }

  get groups() {
    return this.props.homeStore.groups
  }

  get groupName() {
    return get(this.groups, '[0].group.name')
  }

  get isAdmin() {
    return this.groups.map(i => i.isAdmin).includes(1)
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

  async getDetail() {
    if (this.isAdmin) {
      // ?????????????????????
      this.groupStore.getNodesData()
      const gres = await this.reviewStore.getGroupResTotal({
        id: this.groups.map(i => i.gid).join(','),
      })
      this.setState({
        groupRes: gres.code === 200 ? gres.data : [],
      })
    } else {
      // ?????????????????????
      // ????????????????????????
      this.reviewStore.getResTotal()
      this.reviewStore.params = { pageSize: 999999, current: 1, status: -1 }
      // ????????????????????????
      this.reviewStore.getApplyHis()
    }
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
    // ??????clusters??????
    this.props.rootStore.myClusters = this.props.match.params
    // todo ??????1????????????
  }

  // ?????????????????????
  renderResource() {
    if (this.isAdmin) {
      return <GroupResource groupRes={this.state.groupRes} />
    }
    const { countRes } = this.reviewStore
    return <UserResources countRes={countRes} />
  }

  renderPlatform() {
    const { nodesTotal, nodesFail = 0 } = this.groupStore
    const { total, totalFail } = this.appStore
    const { allHis } = this.reviewStore
    const alertTotal = this.appStore.alertMsgs.length
    const readTotal = this.appStore.alertMsgs.filter(i => i.read === 0).length
    return (
      <Panel title="????????????">
        <Row>
          <Col span={8}>
            {this.isAdmin ? (
              <Statistic
                title="????????????/??????"
                value={`${nodesTotal}/${nodesTotal - nodesFail}`}
                valueStyle={{ color: '#333' }}
                prefix={<DesktopOutlined />}
              />
            ) : (
              <Statistic
                title="????????????/?????????"
                value={`${allHis.length}/${
                  allHis.filter(i => i.status === 0).length
                }`}
                valueStyle={{ color: '#333' }}
                prefix={<DesktopOutlined />}
              />
            )}
          </Col>
          <Col span={8}>
            <Statistic
              title="????????????/????????????"
              value={`${total}/${totalFail}`}
              valueStyle={{ color: '#333' }}
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="????????????/??????"
              value={`${alertTotal}/${readTotal}`}
              valueStyle={{ color: '#333' }}
              prefix={<AlertOutlined />}
            />
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
        <div className="h3 margin-b12">
          ?????????{this.groupName} - {this.user.name}
        </div>
        <Columns>
          <Column className="is-8">
            {this.renderResource()}
            {this.renderPlatform()}
            {this.isAdmin && <NodesOverview groupStore={this.groupStore} />}
            <MyApps lists={this.appStore.abnormalApp} store={this.appStore} />
            <Alert store={this.appStore} />
          </Column>
          <Column className="is-4">
            <ShortCut isAdmin={this.isAdmin} />
            <UsageRanking match={this.props.match} appStore={this.appStore} />
            <ResourceUsage match={this.props.match} />
          </Column>
        </Columns>
      </div>
    )
  }
}
