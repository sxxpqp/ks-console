import React, { Component } from 'react'
// import { Button } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { trigger } from 'utils/action'
import { inject, observer } from 'mobx-react'
import CRDAppStore from 'stores/application/crd'

@inject('rootStore', 'devopsStore')
@observer
@trigger
export default class AppBanner extends Component {
  store = new CRDAppStore()

  handleTabChange = value => {
    const { workspace, cluster, namespace, devops } = this.props.match.params
    const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}/devops/${devops}`
    // const { workspace, cluster, namespace } = this.props.match.params
    this.props.rootStore.routing.push(`${PATH}/${value}`)
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
          value: 'pipelines',
          label: '流水线',
        },
        {
          value: 'credentials',
          label: '凭证',
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

  // get tips() {
  //   return [
  //     {
  //       title: t('Pipeline'),
  //       description: t('PIPELINE_DESC'),
  //     },
  //     {
  //       title: t('Credentials'),
  //       description: t('CREDENTIALS_DESC'),
  //       // operation: this.canDeployComposingApp ? (
  //       //   <Button onClick={this.showDeploySampleApp}>
  //       //     {t('Deploy Sample App')}
  //       //   </Button>
  //       // ) : null,
  //       // closable: false,
  //     },
  //   ]
  // }

  render() {
    // 调整说明内容
    // this.props = { ...this.props, title: t('DevOps Project') }
    return (
      <Banner
        {...this.props}
        description={t('DEVOPS_DESCRIPTION')}
        tabs={!globals.app.hasKSModule('openpitrix') ? undefined : this.tabs}
        // tips={this.tips}
      />
    )
  }
}
