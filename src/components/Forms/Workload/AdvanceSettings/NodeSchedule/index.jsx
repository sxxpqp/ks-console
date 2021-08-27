import React from 'react'
import { Form } from '@kube-design/components'
import SelectorsInput from './SelectorsInput'

export default class NodeSchedule extends React.Component {
  get prefix() {
    return this.props.prefix || 'spec.template.'
  }

  render() {
    return (
      <Form.Item>
        <SelectorsInput
          name={`${this.prefix}spec.nodeSelector`}
          addText={t('Add Node Selector')}
          {...this.props}
        />
      </Form.Item>
    )
  }
}
