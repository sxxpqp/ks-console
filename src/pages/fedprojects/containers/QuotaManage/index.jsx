import React from 'react'
import { inject } from 'mobx-react'
import { get } from 'lodash'

import Banner from 'components/Cards/Banner'

import ResourceQuota from './ResourceQuota'

import styles from './index.scss'

@inject('projectStore')
class QuotaManage extends React.Component {
  get store() {
    return this.props.projectStore
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  get tips() {
    return [
      {
        title: t('HOW_TO_USE_QUOTA_Q'),
        description: t('HOW_TO_USE_QUOTA_A'),
      },
    ]
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'project-settings',
      project: this.params.namespace,
      cluster: this.params.cluster,
    })
  }

  get canEdit() {
    return this.enabledActions.includes('edit')
  }

  getData = () => {
    this.store.fetchDetail(this.params)
  }

  handleMoreMenuClick = (e, key) => {
    const action = this.enabledItemActions.find(_action => _action.key === key)
    if (action && action.onClick) {
      action.onClick()
    }
  }

  render() {
    const { clusters } = this.props.projectStore.detail
    return (
      <div>
        <Banner
          icon="cdn"
          title={t('Quota Management')}
          description={t('PROJECT_QUOTA_MANAGE_DESC')}
          tips={this.tips}
        />
        <div className={styles.title}>{t('Quota Management')}</div>
        {clusters.map(cluster => (
          <ResourceQuota
            key={cluster.name}
            cluster={cluster}
            {...this.props.match.params}
            canEdit={this.canEdit}
          />
        ))}
      </div>
    )
  }
}

export default QuotaManage
