import React from 'react'
import { Form } from '@kube-design/components'
import { EnvironmentInput } from 'components/Inputs'

export default class Environments extends React.Component {
  static defaultProps = {
    prefix: '',
    checkable: true,
  }

  get prefix() {
    const { prefix } = this.props

    return prefix ? `${prefix}.` : ''
  }

  render() {
    const { checkable, configMaps, secrets } = this.props
    return (
      <Form.Group
        label={t('Environment Variables')}
        desc={t('CONTAINER_ENVIROMENT_DESC')}
        checkable={checkable}
      >
        <Form.Item>
          <EnvironmentInput
            name={`${this.prefix}env`}
            configMaps={configMaps}
            secrets={secrets}
          />
        </Form.Item>
      </Form.Group>
    )
  }
}
