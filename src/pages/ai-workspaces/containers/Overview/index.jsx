import React from 'react'
import { observer, inject } from 'mobx-react'

import { renderRoutes } from 'utils/router.config'

import Banner from 'components/Cards/Banner'

import styles from './index.scss'

@inject('rootStore')
@observer
class WorkspaceOverview extends React.Component {
  get tips() {
    return [
      {
        title: t('HOW_TO_APPLY_MORE_CLUSTER_Q'),
        description: t('HOW_TO_APPLY_MORE_CLUSTER_A'),
      },
    ]
  }

  renderBanner() {
    const { route } = this.props

    return (
      <div className={styles.banner}>
        <Banner
          className={styles.header}
          icon="dashboard"
          title={t('Overview')}
          description={t('WORKSPACE_OVERVIEW_DESC')}
          module={this.module}
          routes={route.routes}
          tips={globals.app.isMultiCluster ? this.tips : []}
        />
      </div>
    )
  }

  render() {
    const { route } = this.props

    return (
      <div className={styles.wrapper}>
        {this.renderBanner()}
        <div className={styles.main}>{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}

export default WorkspaceOverview
