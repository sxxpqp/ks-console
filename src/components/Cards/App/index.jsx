import React from 'react'

import { Image } from 'components/Base'

import styles from './index.scss'

const AppCard = ({ app }) => (
  <div className={styles.wrapper}>
    <div className={styles.title}>
      <span className={styles.icon}>
        <Image iconSize={48} src={app.icon} iconLetter={app.name} alt="" />
      </span>
      <div className={styles.text}>
        <p>
          <strong>{app.name || '-'}</strong>
        </p>
        <p className={styles.desc} title={app.description || ''}>
          {app.description || '-'}
        </p>
      </div>
    </div>
    <div className={styles.bottom}>
      <span className={styles.vendor}>
        {t('Developer')}: {app.owner || '-'}
      </span>
      <span className={styles.version} title={app.latest_app_version.name}>
        {t('Latest')}: {app.latest_app_version.name || '-'}
      </span>
    </div>
  </div>
)

export default AppCard
