import React from 'react'
import { Form, Input } from '@kube-design/components'
import { ArrayInput } from 'components/Inputs'

import styles from './index.scss'

export default class AccessControl extends React.Component {
  get prefix() {
    return this.props.prefix || 'securityContext'
  }

  render() {
    return (
      <div className="margin-b12">
        <div className={styles.title}>Capabilities (Beta)</div>
        <div className={styles.content}>
          <Form.Item label="Add">
            <ArrayInput name={`${this.prefix}.capabilities.add`}>
              <Input />
            </ArrayInput>
          </Form.Item>
          <Form.Item label="Drop">
            <ArrayInput name={`${this.prefix}.capabilities.drop`}>
              <Input />
            </ArrayInput>
          </Form.Item>
        </div>
      </div>
    )
  }
}
