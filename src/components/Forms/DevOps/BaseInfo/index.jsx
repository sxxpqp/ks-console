import React from 'react'
import { Form, Input, TextArea } from '@kube-design/components'
import Title from 'components/Forms/Base/Title'
import { PATTERN_NAME } from 'utils/constants'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div>
        <Title
          className={styles.devopsTitle}
          title={t('Basic Info')}
          desc={t('DEVOPS_BASEINFO_DESC')}
        />
        <Form className={styles.form} data={formTemplate} ref={formRef}>
          <Form.Item
            label={t('Name')}
            desc={t('NAME_DESC')}
            rules={[
              { required: true, message: t('Please input name') },
              { pattern: PATTERN_NAME, message: t('PATTERN_NAME_INVALID_TIP') },
            ]}
          >
            <Input name="name" autoFocus={true} maxLength={63} />
          </Form.Item>
          <Form.Item label={t('Description')}>
            <TextArea name="description" />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
