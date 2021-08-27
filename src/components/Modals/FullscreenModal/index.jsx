import React from 'react'
import { Modal } from 'components/Base'
import classnames from 'classnames'

import styles from './index.scss'

export default function FullscreenModal(WrappedComponent, options = {}) {
  class observerModal extends React.Component {
    pageClose() {
      window.opener = null
      window.open('', '_self', '')
      window.close()
    }

    render() {
      const { title, onCancel, icon, description, ...otherProps } = this.props
      return (
        <Modal
          visible
          fullScreen
          hideFooter
          title={title}
          icon={icon}
          description={description}
          onCancel={onCancel}
          className={styles.container}
          headerClassName={styles.header}
          bodyClassName={classnames(styles.body, styles.fullScreen)}
        >
          <WrappedComponent
            onCancel={options.isSinglePage ? this.pageClose : onCancel}
            {...otherProps}
          />
        </Modal>
      )
    }
  }

  return observerModal
}
