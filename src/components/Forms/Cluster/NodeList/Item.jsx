import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from '@kube-design/components'
import { NODE_ROLE_TAG_TYPE } from 'utils/constants'
import { List } from 'components/Base'

const Item = ({ index, node, onDelete, onEdit }) => {
  const handleDelete = () => onDelete(node)
  const handleEdit = () => onEdit(index)

  const title = (
    <span>
      {node.name}
      {node.roles.map(role => (
        <Tag key={role} className="margin-l8" type={NODE_ROLE_TAG_TYPE[role]}>
          {role}
        </Tag>
      ))}
    </span>
  )

  return (
    <List.Item
      icon="nodes"
      title={title}
      description={node.address}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  )
}

Item.propTypes = {
  node: PropTypes.object,
}

export default Item
