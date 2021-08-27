import React from 'react'

import { ReactComponent as BackIcon } from 'assets/back.svg'
import styles from './index.scss'

export default function withBack(WrappedComponent) {
  return class WithBack extends React.Component {
    render() {
      const {
        wrapperOnBack,
        wrapperClassName,
        wrapperTitle = '',
        hiddenBack = false,
        ...wrappedComponentProps
      } = this.props
      return (
        <div className={wrapperClassName}>
          <h3 className={styles.title}>
            {hiddenBack || <BackIcon onClick={wrapperOnBack} />}
            <strong>{wrapperTitle}</strong>
          </h3>
          <div className={styles.content}>
            <WrappedComponent {...wrappedComponentProps} />
          </div>
        </div>
      )
    }
  }
}
