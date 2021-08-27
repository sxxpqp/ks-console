import React from 'react'
import { Form } from '@kube-design/components'
import SelectorsInput from './SelectorsInput'

export default class NodeSchedule extends React.Component {
  get prefix() {
    return this.props.isFederated
      ? `${this.props.kind}.spec.template.spec.template.spec.`
      : `${this.props.kind}.spec.template.spec.`
  }

  render() {
    return (
      <Form.Item>
        <SelectorsInput
          name={`${this.prefix}nodeSelector`}
          addText={t('Add Node Selector')}
          {...this.props}
        />
      </Form.Item>
    )
  }
}
