import React from 'react'
import { Column, Columns, Form, Input } from '@kube-design/components'

import styles from './index.scss'

export default class SELinuxOptions extends React.Component {
  get prefix() {
    return this.props.prefix || 'securityContext'
  }

  render() {
    return (
      <div className="margin-b12">
        <div className={styles.title}>seLinuxOptions</div>
        <div className={styles.content}>
          <Columns>
            <Column>
              <Form.Item label="Level">
                <Input name={`${this.prefix}.seLinuxOptions.level`} />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item label="Role">
                <Input name={`${this.prefix}.seLinuxOptions.role`} />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            <Column>
              <Form.Item label="Type">
                <Input name={`${this.prefix}.seLinuxOptions.type`} />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item label="User">
                <Input name={`${this.prefix}.seLinuxOptions.user`} />
              </Form.Item>
            </Column>
          </Columns>
        </div>
      </div>
    )
  }
}
