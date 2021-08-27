import React from 'react'
import classnames from 'classnames'

import { Column, Columns, Form, Input } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class UrlInput extends React.Component {
  static defaultProps = {
    hostName: 'Host',
    portName: 'Port',
    defaultPort: 9200,
    hostRules: [{ required: true, message: t('Please enter the address') }],
    portRules: [{ required: true, message: t('Please input port') }],
  }

  render() {
    const { className, readOnly } = this.props
    return (
      <Columns className={classnames(styles.columns, className)}>
        <Column className="is-7">
          <Form.Item rules={this.props.hostRules}>
            <Input
              name={this.props.hostName}
              placeholder={`${t('eg.')}192.168.1.10`}
              readOnly={readOnly}
            />
          </Form.Item>
        </Column>
        <Column>
          <Form.Item rules={this.props.portRules}>
            <NumberInput
              min={0}
              max={65535}
              name={this.props.portName}
              onChange={this.onPortChange}
              defaultValue={this.props.defaultPort}
              readOnly={readOnly}
              integer
            />
          </Form.Item>
        </Column>
      </Columns>
    )
  }
}
