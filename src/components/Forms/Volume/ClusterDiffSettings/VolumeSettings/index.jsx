import React, { Component } from 'react'
import { get, set, isEmpty, cloneDeep, uniqBy } from 'lodash'
import classNames from 'classnames'

import EditForm from '../EditForm'
import VolumeSettings from '../../VolumeSettings/FormTemplate'

import styles from './index.scss'

export default class VolumeSettingsDiff extends Component {
  state = {
    formData: this.getFormData(),
    isEdit: false,
  }

  showEdit = () => {
    this.setState({ isEdit: true })
    this.props.onSelect(this.props.cluster)
  }

  hideEdit = () => {
    this.setState({ isEdit: false })
  }

  handleSubmit = data => {
    const { cluster, formTemplate } = this.props

    const clusterOverrides = []
    Object.keys(data.spec).forEach(key => {
      const path = `spec.${key}`
      const value = get(data, path)
      if (get(formTemplate, `spec.template.${path}`) !== value) {
        clusterOverrides.push({
          path: `/${path.replace(/\./g, '/')}`,
          value,
        })
      }
    })

    const overrides = get(formTemplate, 'spec.overrides', [])
    const override = overrides.find(item => item.clusterName === cluster)
    if (override) {
      override.clusterOverrides = uniqBy(
        [...clusterOverrides, ...(override.clusterOverrides || [])],
        'path'
      )
    } else {
      overrides.push({ clusterName: cluster, clusterOverrides })
    }

    set(formTemplate, 'spec.overrides', overrides)

    this.setState({ formData: this.getFormData(), isEdit: false })
  }

  getFormData() {
    const { cluster, formTemplate } = this.props
    const override =
      get(formTemplate, 'spec.overrides', []).find(
        item => item.clusterName === cluster
      ) || {}

    const template = {
      spec: cloneDeep(get(formTemplate, 'spec.template.spec')),
    }

    if (override && !isEmpty(override.clusterOverrides)) {
      override.clusterOverrides.forEach(item => {
        if (item.path.startsWith('/spec')) {
          const subPath = item.path.slice(1).replace(/\//g, '.')
          set(template, subPath, item.value)
        }
      })
    }

    return template
  }

  render() {
    const { cluster, namespace, selected } = this.props
    const { formData, isEdit } = this.state

    return (
      <div
        className={classNames(styles.wrapper, {
          [styles.selected]: selected,
        })}
      >
        <EditForm
          title={`${t('Storage Class')}: ${get(
            formData,
            'spec.storageClassName'
          )}`}
          formData={formData}
          isEdit={isEdit}
          showEdit={this.showEdit}
          hideEdit={this.hideEdit}
          onOk={this.handleSubmit}
        >
          <VolumeSettings cluster={cluster} namespace={namespace} />
        </EditForm>
      </div>
    )
  }
}
