import React from 'react'
import { Column, Columns, Form } from '@kube-design/components'
import { CheckableText } from 'components/Base'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class UserGroup extends React.Component {
  get prefix() {
    return this.props.prefix || 'securityContext'
  }

  render() {
    return (
      <div className="margin-b12">
        <div className={styles.title}>{t('User and User Group')}</div>
        <div className={styles.content}>
          <Form.Item>
            <CheckableText
              name={`${this.prefix}.runAsNonRoot`}
              title={t('RUN_AS_NON_ROOT')}
              description={t('RUN_AS_NON_ROOT_DESC')}
            />
          </Form.Item>
          <div className="padding-12">
            <Columns>
              <Column>
                <Form.Item label={t('User')} desc={t('RUN_AS_USER_DESC')}>
                  <NumberInput name={`${this.prefix}.runAsUser`} integer />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label={t('User Group')}
                  desc={t('RUN_AS_USER_GROUP_DESC')}
                >
                  <NumberInput name={`${this.prefix}.runAsGroup`} integer />
                </Form.Item>
              </Column>
            </Columns>
          </div>
        </div>
      </div>
    )
  }
}
