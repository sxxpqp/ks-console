import React from 'react'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'

import { getDocsUrl } from 'utils'

import styles from './index.scss'

export default class Help extends React.Component {
  render() {
    const { className } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.header}>
          <Icon name="question" size={24} />
          {t('Help Information')}
        </div>
        <div className={styles.tip}>
          <a
            href={getDocsUrl('project_members')}
            target="_blank"
            rel="noreferrer noopener"
          >
            💁 {t('How do I invite other members to the current project?')}
          </a>
        </div>
        <div className={styles.tip}>
          <a
            href={getDocsUrl('internet')}
            target="_blank"
            rel="noreferrer noopener"
          >
            💁 {t('How do I set the project gateway?')}
          </a>
        </div>
      </div>
    )
  }
}
