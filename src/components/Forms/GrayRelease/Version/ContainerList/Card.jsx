import React from 'react'
import PropTypes from 'prop-types'

import { Input, Tag } from '@kube-design/components'
import { List } from 'components/Base'

import styles from './index.scss'

const Card = ({ type = 'worker', container, onEdit, onDelete, disabled }) => {
  const handleImageChange = (e, value) => {
    container.image = value
  }
  const handleDelete = () => onDelete({ type, ...container })
  const handleEdit = () => onEdit({ type, ...container })

  const extras = (
    <div className={styles.inputs}>
      <Input
        defaultValue={container.image}
        onChange={handleImageChange}
        disabled={disabled}
      />
    </div>
  )

  const title =
    type === 'init' ? (
      <span>
        {container.name}
        <Tag className="margin-l8" type="warning">
          {t('Init Container')}
        </Tag>
      </span>
    ) : (
      container.name
    )

  return (
    <List.Item
      icon="docker"
      title={title}
      className={styles.card}
      description={`${t('Image')}: ${container.image}`}
      extras={extras}
      onDelete={!disabled && handleDelete}
      onEdit={!disabled && handleEdit}
    />
  )
}

Card.propTypes = {
  container: PropTypes.object,
}

export default Card
