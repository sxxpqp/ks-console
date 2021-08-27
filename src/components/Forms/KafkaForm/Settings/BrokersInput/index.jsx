import React from 'react'
import { get } from 'lodash'
import { ObjectInput, ArrayInput, NumberInput } from 'components/Inputs'
import { Input } from '@kube-design/components'

import styles from './index.scss'

export default class BrokersInput extends React.Component {
  onChange = (value = {}) => {
    const Brokers = value
      .map(({ host = '', port = '' }) => `${host.replace(/,/g, '')}:${port}`)
      .join(',')
    this.props.onChange(Brokers)
  }

  render() {
    const brokers = get(this.props, 'value', '')
      .split(',')
      .map(broker => {
        const [, host = '', port = ''] = broker.match(/(.*):(.*)$/) || []
        return {
          port,
          host,
        }
      })

    return (
      <ArrayInput
        addText={t('Add Service Address')}
        itemType="object"
        value={brokers}
        onChange={this.onChange}
      >
        <ObjectInput className={styles.address}>
          <Input
            name="host"
            className={styles.host}
            placeholder={`${t('eg.')} 192.168.1.10`}
          />
          <NumberInput
            className={styles.port}
            placeholder="9092"
            name="port"
            min={0}
            max={65535}
            integer
          />
        </ObjectInput>
      </ArrayInput>
    )
  }
}
