import React, { Component } from 'react'
import { Button } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { trigger } from 'utils/action'
import { inject, observer } from 'mobx-react'
import CRDAppStore from 'stores/application/crd'

@inject('rootStore', 'projectStore')
@observer
@trigger
export default class AppBanner extends Component {
  store = new CRDAppStore()

  handleTabChange = value => {
    const { workspace, cluster, namespace } = this.props.match.params
    this.props.rootStore.routing.push(
      `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/${value}`
    )
  }

  get canDeployComposingApp() {
    const { workspace, cluster, namespace: project } = this.props.match.params
    const canCreateDeployment = globals.app
      .getActions({
        workspace,
        cluster,
        project,
        module: 'deployments',
      })
      .includes('create')

    const canCreateService = globals.app
      .getActions({
        workspace,
        cluster,
        project,
        module: 'services',
      })
      .includes('create')

    return canCreateDeployment && canCreateService
  }

  get tabs() {
    const { type } = this.props
    return {
      value: type,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'template',
          label: t('App Templates'),
        },
        {
          value: 'composing',
          label: t('Composing Apps'),
        },
      ],
    }
  }

  showDeploySampleApp = () => {
    const { rootStore, projectStore, match } = this.props

    this.trigger('crd.app.create', {
      sampleApp: 'bookinfo',
      module: 'applications',
      ...match.params,
      store: this.store,
      projectDetail: projectStore.detail,
      success: url => rootStore.routing.push(url),
    })
  }

  get tips() {
    return [
      {
        title: t('Application Type'),
        description: t('APPLICATION_TYPE_DESC'),
      },
      {
        title: t('HOW_TO_USE_APPLICATION_GOVE_Q'),
        description: t('HOW_TO_USE_APPLICATION_GOVE_A'),
        operation: this.canDeployComposingApp ? (
          <Button onClick={this.showDeploySampleApp}>
            {t('Deploy Sample App')}
          </Button>
        ) : null,
        closable: false,
      },
    ]
  }

  render() {
    return (
      <Banner
        {...this.props}
        description={t('APPLICATIONS_DESC')}
        tabs={!globals.app.hasKSModule('openpitrix') ? undefined : this.tabs}
        tips={this.tips}
      />
    )
  }
}
