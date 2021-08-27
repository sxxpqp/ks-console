import React from 'react'
import { Button } from '@kube-design/components'
import { Modal } from 'components/Base'
import classNames from 'classnames'

import styles from './index.scss'

export default function CustomMonitoringModal({
  title,
  description,
  onCancel,
  children,
  operations,
  className,
}) {
  return (
    <Modal
      fullScreen
      hideFooter
      visible
      title={title}
      description={description}
      icon="monitor"
      className={classNames(styles.wrapper, className)}
      headerClassName={styles.header}
      bodyClassName={styles.body}
      closable={false}
      operations={
        <div className={styles.operations}>
          {operations}
          <Button
            icon="close"
            iconType="light"
            type="control"
            onClick={onCancel}
            className={styles.close}
          />
        </div>
      }
    >
      {children}
    </Modal>
  )
}
