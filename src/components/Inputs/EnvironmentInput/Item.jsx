import { get, has, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { getDisplayName } from 'utils'

import { Input, Select } from '@kube-design/components'

import ObjectInput from '../ObjectInput'

export default class EnvironmentInputItem extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    configMaps: PropTypes.array,
    secrets: PropTypes.array,
  }

  static defaultProps = {
    name: '',
    value: {},
    onChange() {},
    configMaps: [],
    secrets: [],
  }

  parseValue(data) {
    const resourceType = has(data, 'configMapKeyRef')
      ? 'configMapKeyRef'
      : 'secretKeyRef'
    const resourceName = get(data, `${resourceType}.name`, '')
    const resourceKey = get(data, `${resourceType}.key`, '')
    return { resourceType, resourceName, resourceKey }
  }

  handleChange = value => {
    const { configMaps, secrets, onChange } = this.props
    const newValue = { name: value.name, valueFrom: {} }
    if (value.resource) {
      const resourceType = value.resource.startsWith('configmap-')
        ? 'configMapKeyRef'
        : 'secretKeyRef'

      let data
      if (resourceType === 'configMapKeyRef') {
        const name = value.resource.replace('configmap-', '')
        data = configMaps.find(item => item.name === name)
      } else if (resourceType === 'secretKeyRef') {
        const name = value.resource.replace('secret-', '')
        data = secrets.find(item => item.name === name)
      }

      if (data) {
        newValue.valueFrom = {
          [resourceType]: {
            name: data.name,
            key: value.resourceKey,
          },
        }
      }

      if (!newValue.name && value.resourceKey) {
        newValue.name = value.resourceKey
      }
    }

    onChange(newValue)
  }

  getResourceOptions() {
    const { configMaps, secrets } = this.props
    const options = []

    if (!isEmpty(configMaps)) {
      options.push({
        label: t('ConfigMap'),
        options: configMaps.map(item => ({
          label: getDisplayName(item),
          value: `configmap-${item.name}`,
          type: 'ConfigMap',
        })),
      })
    }

    if (!isEmpty(secrets)) {
      options.push({
        label: t('Secret'),
        options: secrets.map(item => ({
          label: getDisplayName(item),
          value: `secret-${item.name}`,
          type: 'Secret',
        })),
      })
    }

    return options
  }

  valueRenderer = option => (
    <p>
      {option.label}
      <span style={{ color: '#abb4be' }}>
        ({isEmpty(option.type) ? t('Select resource') : t(option.type)})
      </span>
    </p>
  )

  getKeysOptions({ resourceType, resourceName }) {
    const { configMaps, secrets } = this.props

    let data
    if (resourceType === 'configMapKeyRef') {
      data = configMaps.find(item => item.name === resourceName)
    } else if (resourceType === 'secretKeyRef') {
      data = secrets.find(item => item.name === resourceName)
    }

    if (!data) {
      return []
    }

    return Object.keys(data.data || {}).map(key => ({
      label: key,
      value: key,
    }))
  }

  render() {
    const { value = {}, onChange } = this.props

    if (value.valueFrom) {
      const { resourceType, resourceName, resourceKey } = this.parseValue(
        value.valueFrom
      )
      const formatValue = {
        name: value.name,
        resource: `${
          resourceType === 'configMapKeyRef' ? 'configmap' : 'secret'
        }-${resourceName}`,
        resourceKey,
      }

      return (
        <ObjectInput value={formatValue} onChange={this.handleChange}>
          <Input name="name" placeholder={t('name')} />
          <Select
            name="resource"
            placeholder={t('Select resource')}
            options={this.getResourceOptions()}
            valueRenderer={this.valueRenderer}
          />
          <Select
            name="resourceKey"
            placeholder={t('Select Key')}
            options={this.getKeysOptions({ resourceType, resourceName })}
          />
        </ObjectInput>
      )
    }

    return (
      <ObjectInput value={value} onChange={onChange}>
        <Input name="name" placeholder={t('name')} />
        <Input name="value" placeholder={t('value')} />
      </ObjectInput>
    )
  }
}
