import React from 'react'
// import { isEmpty } from 'lodash'

import { getLocalTime } from 'utils'
import { Icon } from '@kube-design/components'
import { inject } from 'mobx-react'

import EmptyList from 'components/Cards/EmptyList'
import HomeStore from 'stores/ai-platform/home'
import AdminDashboard from './Admin'

import styles from './index.scss'

@inject('rootStore')
class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.homeStore = new HomeStore()

    if (!globals.app.isPlatformAdmin) {
      // if (globals.user.globalrole === 'users-manager') {
      //   return this.routing.push(`/access/accounts`)
      // }
      // if (globals.app.getActions({ module: 'workspaces' }).includes('create')) {
      //   return this.routing.push(`/access/workspaces`)
      // }
      // // debugger
      // if (!isEmpty(globals.user.workspaces)) {
      //   return this.routing.push(`/workspaces/${this.workspace}`)
      // }
    }
  }

  componentDidMount() {
    const redirect = user => {
      this.routing.push(
        `${user.workspace}/clusters/${user.cluster}/projects/${user.namespace}/home`
      )
      this.props.rootStore.myClusters = {
        namespace: user.namespace,
        workspace: user.workspace,
        cluster: user.cluster,
      }
    }
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    if (namespace && workspace && cluster) {
      this.routing.push(
        `${workspace}/clusters/${cluster}/projects/${namespace}/home`
      )
    } else {
      const user = globals.user && globals.user.ai
      if (user) {
        redirect(user)
      } else {
        this.homeStore.getUser().then(res => {
          if (res.code === 200) {
            const tmp = globals.user && globals.user.ai
            redirect(tmp)
          } else {
            window.location.href = '/login'
          }
        })
      }
    }
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get workspace() {
    let workspace
    const savedWorkspace = localStorage.getItem(
      `${globals.user.username}-workspace`
    )

    if (savedWorkspace && globals.app.workspaces.includes(savedWorkspace)) {
      workspace = savedWorkspace
    } else {
      workspace = globals.app.workspaces[0]
    }

    return workspace
  }

  renderHeader() {
    const { avatar_url, globalrole, username, lastLoginTime } =
      globals.user || {}

    const loginTime = `${t('Last login time')}: ${getLocalTime(
      lastLoginTime
    ).format(`YYYY-MM-DD HH:mm:ss`)}`

    return (
      <div className={styles.header} data-test="dashboard-header">
        <div className={styles.avatar}>
          <img src={avatar_url || '/assets/default-user.svg'} />
        </div>
        <div className={styles.title}>
          <strong>{t('DASHBOARD_TITLE', { username })}</strong>
          <div className={styles.info}>
            <p>
              <Icon name="role" size={16} />
              {globalrole}
            </p>
            <p>
              <Icon name="clock" size={16} />
              {loginTime}
            </p>
          </div>
        </div>
      </div>
    )
  }

  renderContent() {
    if (globals.app.isPlatformAdmin) {
      return <AdminDashboard />
    }

    return (
      <EmptyList
        title={t('USER_DASHBOARD_EMPTY_TITLE')}
        desc={t('USER_DASHBOARD_EMPTY_DESC')}
      />
    )
  }

  render() {
    return (
      <div className={styles.dashboard}>
        {/* <div className={styles.wrapper}>
          {this.renderHeader()}
          {this.renderContent()}
        </div> */}
      </div>
    )
  }
}

export default Dashboard
