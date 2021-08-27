import React from 'react'
import { observer, inject } from 'mobx-react'
import { isEmpty } from 'lodash'

import Banner from 'components/Cards/Banner'
import InternetAccess from './InternetAccess'
import LogCollection from './LogCollection'

@inject('rootStore', 'projectStore')
@observer
class AdvancedSettings extends React.Component {
  get store() {
    return this.props.projectStore
  }

  get namespace() {
    return this.props.match.params.namespace
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get enableActions() {
    return globals.app.getActions({
      module: 'project-settings',
      ...this.props.match.params,
      project: this.namespace,
    })
  }

  get disabledLoggingSideCar() {
    if (isEmpty(globals.config.disabledLoggingSidecarNamespace)) {
      return false
    }

    return globals.config.disabledLoggingSidecarNamespace.includes(
      this.namespace
    )
  }

  get tips() {
    return [
      {
        title: t('WHAT_IS_INTERNET_GATEWAY'),
        description: t('PROJECT_INTERNET_ACCESS_DESC'),
      },
      {
        title: t('What is Disk Log Collection?'),
        description: t('WHAT_IS_COLLECT_FILE_LOG_A'),
      },
    ]
  }

  render() {
    return (
      <div>
        <Banner
          icon="cogwheel"
          title={t('Advanced Settings')}
          description={t('PROJECT_ADVANCED_SETTINGS_DESC')}
          tips={this.tips}
        />
        <InternetAccess match={this.props.match} actions={this.enableActions} />
        {globals.app.hasClusterModule(this.cluster, 'logging') &&
          !this.disabledLoggingSideCar && (
            <LogCollection store={this.store} actions={this.enableActions} />
          )}
      </div>
    )
  }
}

export default AdvancedSettings
