import React from 'react'

import { PATTERN_PORT_NAME } from 'utils/constants'
import { Form } from '@kube-design/components'
import {
  ContainerPort,
  ContainerServicePort,
  ArrayInput,
} from 'components/Inputs'

export default class Ports extends React.Component {
  static defaultProps = {
    prefix: '',
  }

  get prefix() {
    const { prefix } = this.props

    return prefix ? `${prefix}.` : ''
  }

  portsValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value.length > 0) {
      const names = []
      value.forEach(item => {
        if (
          !item.name ||
          !item.containerPort ||
          (this.props.withService && !item.servicePort)
        ) {
          return callback({ message: t('Invalid port') })
        }

        if (names.includes(item.name)) {
          return callback({ message: t('PORT_INPUT_DESC') })
        }

        if (
          item.name &&
          (item.name.length > 15 || !PATTERN_PORT_NAME.test(item.name))
        ) {
          return callback({ message: t('WORKLOAD_PORT_NAME_DESC') })
        }

        names.push(item.name)
      })
    }

    callback()
  }

  checkContainerPortValid = value => {
    if (this.props.withService) {
      return value && value.name && value.containerPort && value.servicePort
    }

    return value && value.name && value.containerPort
  }

  render() {
    const { withService, className } = this.props
    return (
      <Form.Group
        className={className}
        label={withService ? t('Service Settings') : t('Port Settings')}
        desc={t('Please set the access policy for the container.')}
      >
        <Form.Item
          rules={[
            { required: withService, message: t('Please input ports') },
            { validator: this.portsValidator, checkOnSubmit: true },
          ]}
        >
          <ArrayInput
            name={`${this.prefix}ports`}
            itemType="object"
            addText={t('Add Port')}
            checkItemValid={this.checkContainerPortValid}
          >
            {withService ? <ContainerServicePort /> : <ContainerPort />}
          </ArrayInput>
        </Form.Item>
      </Form.Group>
    )
  }
}
