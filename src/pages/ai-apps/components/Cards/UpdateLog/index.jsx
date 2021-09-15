import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

export default class UpdateLog extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string,
  }

  static defaultProps = {
    description: '',
  }

  render() {
    const { description } = this.props

    return (
      <div className={styles.main}>
        <div className={styles.title}>{t('Update Log')}</div>
        <pre className={styles.updateLog}>
          {description || t('No update log')}
        </pre>
      </div>
    )
  }
}
