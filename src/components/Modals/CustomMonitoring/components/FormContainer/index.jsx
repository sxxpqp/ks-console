import React from 'react'

import { Form, Button } from '@kube-design/components'

import styles from './index.scss'

export default function FormContainer({
  formData,
  children,
  onCancel,
  onSubmit,
}) {
  return (
    <Form className={styles.wrapper} data={formData} onSubmit={onSubmit}>
      <div className={styles.form}>{children}</div>
      <div className={styles.formFooter}>
        <Button
          type="control"
          icon="close"
          iconType="light"
          onClick={onCancel}
        />
        <Button
          type="control"
          icon="check"
          iconType="light"
          htmlType="submit"
        />
      </div>
    </Form>
  )
}
