import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Text } from 'components/Base'

import styles from './index.scss'

const Card = ({ volume, prefix }) => {
  const description = `${t('Storage Classs')}: ${get(
    volume,
    'storageClassName',
    '-'
  )}`
  const details = [
    {
      title: get(volume, 'capacity', '-'),
      description: t('Capacity'),
    },
    {
      title: get(volume, 'accessMode', '-'),
      description: t('Access Mode'),
    },
  ]
  return (
    <div className={styles.item}>
      <Text
        icon="storage"
        title={
          <Link to={`${prefix}/volumes/${volume.name}`}>{volume.name}</Link>
        }
        description={description}
      />
      {details.map((params, index) => (
        <Text key={index} {...params} />
      ))}
    </div>
  )
}

Card.propTypes = {
  container: PropTypes.object,
}

export default Card
