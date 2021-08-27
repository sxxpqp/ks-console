import React from 'react'
import { Form } from '@kube-design/components'
import { CheckableText } from 'components/Base'

import styles from './index.scss'

export default class AccessControl extends React.Component {
  get prefix() {
    return this.props.prefix || 'securityContext'
  }

  render() {
    return (
      <div className="margin-b12">
        <div className={styles.title}>{t('Access Control')}</div>
        <div className={styles.content}>
          <Form.Item>
            <CheckableText
              name={`${this.prefix}.privileged`}
              title={t('ACCESS_CONTROL_PRIVILEGED')}
              description={t('ACCESS_CONTROL_PRIVILEGED_DESC')}
            />
          </Form.Item>
          <Form.Item>
            <CheckableText
              name={`${this.prefix}.allowPrivilegeEscalation`}
              title={t('ACCESS_CONTROL_ALLOWPRIVILEGEESCALATION')}
              description={t('ACCESS_CONTROL_ALLOWPRIVILEGEESCALATION_DESC')}
            />
          </Form.Item>
          <Form.Item>
            <CheckableText
              name={`${this.prefix}.readOnlyRootFilesystem`}
              title={t('ACCESS_CONTROL_READONLYROOTFILESYSTEM')}
              description={t('ACCESS_CONTROL_READONLYROOTFILESYSTEM_DESC')}
            />
          </Form.Item>
        </div>
      </div>
    )
  }
}
