import { get, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon } from '@kube-design/components'

import { List } from 'components/Base'

import styles from './index.scss'

const Card = ({ volume, match, isMultiProject }) => {
  const { workspace, cluster, namespace } = match.params

  const prefix = `${
    workspace ? `/${workspace}` : ''
  }/clusters/${cluster}/projects/${namespace}`

  let icon = 'storage'
  let description
  let details
  if (volume.hostPath) {
    description = `${t('Type')}: ${t('HostPath')}`
    details = [
      { title: get(volume, 'hostPath.path', '-'), description: t('Host Path') },
    ]
  } else if (volume.emptyDir) {
    description = `${t('Type')}: ${t('EmptyDir')}`
    details = []
  } else if (volume.configMap) {
    icon = 'hammer'
    description = `${t('Type')}: ${t('ConfigMap')}`
    const configmap = get(volume, 'configMap.name', '-')
    details = [
      {
        title: isMultiProject ? (
          configmap
        ) : (
          <Link to={`${prefix}/configmaps/${configmap}`}>{configmap}</Link>
        ),
        description: t('ConfigMap'),
      },
    ]
  } else if (volume.secret) {
    icon = 'key'
    description = `${t('Type')}: ${t('Secret')}`
    const secret = get(volume, 'secret.secretName', '-')
    details = [
      {
        title: isMultiProject ? (
          secret
        ) : (
          <Link to={`${prefix}/secrets/${secret}`}>{secret}</Link>
        ),
        description: t('Secret'),
      },
    ]
  } else {
    description = `${t('Storage Classs')}: ${get(
      volume,
      'storageClassName',
      '-'
    )}`
    const volumeName = get(volume, 'persistentVolumeClaim.claimName', '-')
    details = [
      {
        title: isMultiProject ? (
          volumeName
        ) : (
          <Link to={`${prefix}/volumes/${volumeName}`}>{volumeName}</Link>
        ),
        description: t('Volume'),
      },
      {
        title: get(volume, 'capacity', '-'),
        description: t('Capacity'),
      },
      {
        title: get(volume, 'accessMode', '-'),
        description: t('Access Mode'),
      },
    ]
  }

  const mount = !isEmpty(volume.volumeMounts) && (
    <div className={styles.mount}>
      <ul>
        {volume.volumeMounts.map(
          ({ containerName, mountPath, subPath, logPath, readOnly }) => (
            <li key={`${containerName}-${mountPath}`}>
              <div>
                <Icon name="docker" size={20} />
                <span>{containerName}</span>
              </div>
              <div>
                <Icon name="mgmt-node" size={20} />
                <span>{mountPath}</span>
                <span className="text-secondary">
                  &nbsp;({readOnly ? t('ReadOnly') : t('ReadAndWrite')})
                </span>
              </div>
              {subPath && (
                <div>
                  <Icon name="textfield" size={20} /> <span>{subPath}</span>
                </div>
              )}
              {logPath && (
                <div>
                  <Icon name="log" size={20} /> <span>{logPath}</span>
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  )

  return (
    <List.Item
      icon={icon}
      title={volume.name}
      titleClass={styles.title}
      description={description}
      extras={mount}
      details={details}
    />
  )
}

Card.propTypes = {
  container: PropTypes.object,
}

export default Card
