import React from 'react'
import { Form } from '@kube-design/components'
import StringInput from 'components/Inputs/StringInput'

import styles from './index.scss'

export default class Commands extends React.Component {
  static defaultProps = {
    prefix: '',
  }

  get prefix() {
    const { prefix } = this.props

    return prefix ? `${prefix}.` : ''
  }

  render() {
    return (
      <Form.Group
        label={t('Start Command')}
        desc={t('START_COMMAND_DESC')}
        checkable
      >
        <Form.Item label={t('Run Command')} desc={t('RUN_COMMAND_DESC')}>
          <StringInput
            className={styles.input}
            name={`${this.prefix}command`}
            placeholder={t('Command')}
          />
        </Form.Item>
        <Form.Item label={t('Parameters')} desc={t('CONTAINER_PARAMS_DESC')}>
          <StringInput
            className={styles.input}
            name={`${this.prefix}args`}
            placeholder={t('Argument')}
          />
        </Form.Item>
      </Form.Group>
    )
  }
}
