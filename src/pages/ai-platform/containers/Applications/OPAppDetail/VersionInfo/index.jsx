import React from 'react'

import { Button } from '@kube-design/components'

import styles from './index.scss'

const Item = ({ data, onUpgrade, currentVersion }) => {
  const handleUpgrade = () => onUpgrade(data.version_id)

  return (
    <div className={styles.item}>
      <span>{data.name}</span>
      {currentVersion.version_id === data.version_id && (
        <div className={styles.tag}>{t('Current Version')}</div>
      )}
      {currentVersion.version_id !== data.version_id && (
        <div className={styles.operations}>
          <Button onClick={handleUpgrade}>
            {currentVersion.create_time < data.create_time
              ? t('Upgrade')
              : t('Rollback')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default class VersionInfo extends React.Component {
  render() {
    const {
      data,
      detail,
      cluster,
      workspace,
      namespace,
      onUpgrade,
      onRollback,
    } = this.props
    const currentVersion =
      data.find(item => item.version_id === detail.version_id) || {}

    const urlPrefix = `/apps/${detail.app_id}?workspace=${workspace}&cluster=${cluster}&namespace=${namespace}`

    return (
      <ul>
        {data.map(item => (
          <Item
            key={item.version_id}
            data={item}
            currentVersion={currentVersion}
            onUpgrade={onUpgrade}
            onRollback={onRollback}
            urlPrefix={urlPrefix}
          />
        ))}
      </ul>
    )
  }
}
