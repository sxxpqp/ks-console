import React, { Component } from 'react'
import { get, pick } from 'lodash'

import VolumeSettings from 'components/Forms/Volume/VolumeSettings/FormTemplate'
import EditForm from '../EditForm'

export default class VolumeSettingsDiff extends Component {
  handleSubmit = data => {
    const { index, onEdit } = this.props
    onEdit({ index, data: pick(data, ['spec']) })
  }

  render() {
    const { cluster, namespace, formData } = this.props

    return (
      <EditForm
        {...this.props}
        title={`${t('Storage Class')}: ${get(
          formData,
          'spec.storageClassName'
        )}`}
        onOk={this.handleSubmit}
      >
        <div className="padding-12">
          <VolumeSettings cluster={cluster} namespace={namespace} />
        </div>
      </EditForm>
    )
  }
}
