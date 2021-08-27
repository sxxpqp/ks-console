import React from 'react'
import { Form, Input } from '@kube-design/components'
import Brokers from 'components/Forms/KafkaForm/Settings/BrokersInput'

export default class BaseInfo extends React.Component {
  addressValidator = (rule, value, callback) => {
    const brokers = value.split(',')
    const isValid = brokers.every(broker => {
      const [, host = '', port = ''] = broker.match(/(.*):(.*)$/) || []
      return host && port
    })
    return isValid ? callback() : callback({ message: t('URL_SYNTAX_ERROR') })
  }

  render() {
    return (
      <div>
        <Form.Item label={t('topic')}>
          <Input name="topics" autoComplete="nope" />
        </Form.Item>
        <Form.Item
          label={t('Service Address')}
          rules={[
            { required: true, message: t('Please input service address') },
            { validator: this.addressValidator },
          ]}
        >
          <Brokers name="brokers" />
        </Form.Item>
      </div>
    )
  }
}
