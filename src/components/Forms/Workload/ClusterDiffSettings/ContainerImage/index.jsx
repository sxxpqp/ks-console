import React, { Component } from 'react'
import { get, omit } from 'lodash'

import { observer } from 'mobx-react'

import SecretStore from 'stores/secret'
import QuotaStore from 'stores/quota'
import LimitRangeStore from 'stores/limitrange'

import EditForm from '../EditForm'
import ContainerSetting from '../../ContainerSettings/ContainerForm/ContainerSetting'

@observer
export default class ContainerImages extends Component {
  state = {
    quota: {},
    limitRange: {},
    imageRegistries: [],
  }

  quotaStore = new QuotaStore()

  limitRangeStore = new LimitRangeStore()

  imageRegistryStore = new SecretStore()

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const { cluster, namespace } = this.props

    Promise.all([
      this.quotaStore.fetch({ cluster, namespace }),
      this.limitRangeStore.fetchListByK8s({ cluster, namespace }),
      this.imageRegistryStore.fetchListByK8s({
        cluster,
        namespace,
        fieldSelector: `type=kubernetes.io/dockerconfigjson`,
      }),
    ]).then(([quota, limitRanges, imageRegistries]) => {
      this.setState({
        quota,
        limitRange: get(limitRanges, '[0].limit'),
        imageRegistries,
      })
    })
  }

  handleSubmit = data => {
    const { index, containerType, onEdit } = this.props
    onEdit({ index, containerType, data: omit(data, 'type') })
  }

  render() {
    const { cluster, namespace, formData, containerType } = this.props
    const { quota, limitRanges, imageRegistries } = this.state

    return (
      <EditForm
        {...this.props}
        title={<span>{`${t('Image')}: ${formData.image}`}</span>}
        onOk={this.handleSubmit}
      >
        <ContainerSetting
          data={formData}
          cluster={cluster}
          namespace={namespace}
          quota={quota}
          limitRanges={limitRanges}
          imageRegistries={imageRegistries}
          defaultContainerType={containerType}
        />
      </EditForm>
    )
  }
}
