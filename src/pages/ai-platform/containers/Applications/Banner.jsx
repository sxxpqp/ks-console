import React, { Component } from 'react'
// import { Button } from '@kube-design/components'
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
          label: '容器应用列表',
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
        title: '自制应用与应用模板',
        description:
          '用户可以基于自有的镜像或者代码进行创建应用，或者使用helm配置文件来创建Kubernetes应用',
        // operation: this.canDeployComposingApp ? (
        //   <Button onClick={this.showDeploySampleApp}>
        //     {t('Deploy Sample App')}
        //   </Button>
        // ) : null,
        closable: false,
      },
    ]
  }

  /* <Banner
        {...this.props}
        description={t('APPLICATIONS_DESC')}
        tabs={!globals.app.hasKSModule('openpitrix') ? undefined : this.tabs}
        tips={this.tips}
      /> */

  render() {
    return (
      <Banner
        {...this.props}
        tabs={!globals.app.hasKSModule('openpitrix') ? undefined : this.tabs}
      />
    )
  }
}
