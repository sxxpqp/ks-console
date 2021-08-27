import React from 'react'
import { toJS } from 'mobx'
import { inject } from 'mobx-react'
import { get } from 'lodash'

import Banner from 'components/Cards/Banner'

import ResourceQuota from './ResourceQuota'

import styles from './index.scss'

@inject('workspaceStore')
class QuotaManage extends React.Component {
  get store() {
    return this.props.workspaceStore
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'workspace-settings',
      workspace: this.params.workspace,
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
    const clusters = toJS(this.store.clusters.data)
    return (
      <div>
        <Banner
          icon="cdn"
          title={t('Quota Management')}
          description={t('WORKSPACE_QUOTA_MANAGE_DESC')}
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
