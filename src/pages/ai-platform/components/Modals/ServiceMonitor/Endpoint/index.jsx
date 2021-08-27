import React, { Component } from 'react'
import { get, omit } from 'lodash'
import { Select, Input, Icon } from '@kube-design/components'
import { ObjectInput } from 'components/Inputs'
import Authorization from '../Authorization'
import styles from './index.scss'

export default class Endpoints extends Component {
  get protocols() {
    return [
      {
        label: 'HTTPS',
        value: 'https',
      },
      {
        label: 'HTTP',
        value: 'http',
      },
    ]
  }

  get ports() {
    return get(this.props, 'detail.ports', []).map(item => ({
      label: item.name ? `${item.name}(${item.port})` : item.port,
      value: item.name || item.port,
    }))
  }

  render() {
    return (
      <ObjectInput {...this.props}>
        <Select
          className={styles.schema}
          name="scheme"
          options={this.protocols}
          defaultValue="http"
        />
        <Select
          prefixIcon={<Icon name="network-card" />}
          name="port"
          options={this.ports}
        />
        <Input name="path" defaultValue="/metrics" />
        <Authorization
          name="authType"
          formData={this.props.value}
          {...omit(this.props, ['value', 'onChange'])}
        />
      </ObjectInput>
    )
  }
}
