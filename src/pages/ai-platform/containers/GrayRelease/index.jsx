import { get } from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { getDocsUrl } from 'utils'
import { renderRoutes } from 'utils/router.config'

import ApplicationStore from 'stores/application/crd'

import Banner from 'components/Cards/Banner'
import ServiceDeployAppModal from 'projects/components/Modals/CreateApp'

@inject('rootStore')
@observer
class GrayRelease extends React.Component {
  state = {
    showDeployApp: false,
    sampleApp: '',
  }

  store = new ApplicationStore()

  get tips() {
    return [
      {
        title: t('PREREQUEST_FOR_USE_GRAYRELEASE_Q'),
        description: t('PREREQUEST_FOR_USE_GRAYRELEASE_A'),
        more: getDocsUrl('composingapps'),
      },
    ]
  }

  get routing() {
    return this.props.rootStore.routing
  }

  hideDeployAppModal = () => {
    this.setState({ showDeployApp: false, sampleApp: '' })
  }

  handleDeployApp = data => {
    const { workspace, cluster, namespace } = this.props.match.params
    this.store.create(data).then(() => {
      this.hideDeployAppModal()
      this.routing.push(
        `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/composing/${get(
          data,
          'application.metadata.name'
        )}`
      )
    })
  }

  showDeploySampleApp = () => {
    this.setState({
      showDeployApp: true,
      sampleApp: 'bookinfo',
    })
  }

  render() {
    const { route } = this.props
    const { showDeployApp, sampleApp } = this.state
    const { cluster, namespace } = this.props.match.params

    return (
      <div>
        <Banner
          icon="bird"
          module="grayrelease"
          title={t('Grayscale Release')}
          description={t('GRAY_RELEASE_DESC')}
          tips={this.tips}
          routes={route.routes}
        />
        {renderRoutes(route.routes)}
        <ServiceDeployAppModal
          store={this.store}
          visible={showDeployApp}
          namespace={namespace}
          cluster={cluster}
          sampleApp={sampleApp}
          onOk={this.handleDeployApp}
          onCancel={this.hideDeployAppModal}
          isSubmitting={this.store.isSubmitting}
        />
      </div>
    )
  }
}

export default GrayRelease
