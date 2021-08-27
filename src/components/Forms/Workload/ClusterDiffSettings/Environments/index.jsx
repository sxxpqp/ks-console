import React, { Component } from 'react'
import { observer } from 'mobx-react'

import ConfigMapStore from 'stores/configmap'
import SecretStore from 'stores/secret'

import EditForm from '../EditForm'
import Environments from '../../ContainerSettings/ContainerForm/Environments'

@observer
export default class ContainerImages extends Component {
  state = {
    configMaps: [],
    secrets: [],
  }

  configMapStore = new ConfigMapStore()

  secretStore = new SecretStore()

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const { cluster, namespace } = this.props

    Promise.all([
      this.configMapStore.fetchListByK8s({ cluster, namespace }),
      this.secretStore.fetchListByK8s({ cluster, namespace }),
    ]).then(([configMaps, secrets]) => {
      this.setState({
        configMaps,
        secrets,
      })
    })
  }

  handleSubmit = data => {
    const { index, onEdit } = this.props
    onEdit({ index, data })
  }

  render() {
    const { formData } = this.props
    const { configMaps, secrets } = this.state

    const title = (
      <span>{`${t('Environment Variables')}: ${(formData.env || [])
        .map(item => item.name)
        .join(', ') || t('None')}`}</span>
    )

    return (
      <EditForm {...this.props} title={title} onOk={this.handleSubmit}>
        <Environments
          configMaps={configMaps}
          secrets={secrets}
          checkable={false}
        />
      </EditForm>
    )
  }
}
