import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '@kube-design/components'
import { List } from 'components/Base'

import styles from './index.scss'

const Card = ({ volume, onDelete, onEdit }) => {
  const handleDelete = () => onDelete(volume.metadata.name)
  const handleEdit = () => onEdit(volume)

  const details = [
    {
      title: get(volume, 'spec.resources.requests.storage', '-'),
      description: t('Capacity'),
    },
    {
      title: get(volume, 'spec.accessModes[0]', '-'),
      description: t('Access Mode'),
    },
  ]

  const mount = (
    <div className={styles.mount}>
      <ul>
        {volume.volumeMounts &&
          volume.volumeMounts.map(
            ({ containerName, mountPath, subPath, readOnly }) => (
              <li key={mountPath}>
                <div>
                  <Icon name="docker" size={20} />
                  <span>{containerName}</span>
                </div>
                <div>
                  <Icon name="mgmt-node" size={20} /> <span>{mountPath}</span>
                  <span className="text-secondary">
                    &nbsp;({readOnly ? t('ReadOnly') : t('ReadAndWrite')})
                  </span>
                </div>
                {subPath && (
                  <div>
                    <Icon name="textfield" size={20} /> <span>{subPath}</span>
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
      icon="storage"
      title={get(volume, 'metadata.name', '-')}
      description={`${t('Storage Classs')}: ${get(
        volume,
        'spec.storageClassName',
        '-'
      )}`}
      extras={mount}
      details={details}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  )
}

Card.propTypes = {
  container: PropTypes.object,
}

export default Card
