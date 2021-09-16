import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { Button } from '@kube-design/components'
import { Avatar } from 'components/Base'

import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class GroupCard extends React.Component {
  static propTypes = {
    treeNode: PropTypes.object,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
  }

  renderContent() {
    const {
      treeNode: { children = [] },
      deleteKeys,
      onEdit,
      onDelete,
    } = this.props

    if (children.length > 0) {
      return children.map(child => {
        const item = child.props || child
        return (
          <div className={styles.item} key={item.group_id}>
            <Avatar
              className={styles.avatar}
              icon="group"
              iconSize={32}
              title={getDisplayName({
                name: item.group_name,
                aliasName: item.alias_name,
              })}
              desc={get(
                item._originData,
                'metadata.annotations.["kubesphere.io/workspace-role"]'
              )}
            />
            <div>
              <span className="text-second padding-20">
                {deleteKeys.includes(item.group_id) && t('deleting')}
              </span>
              <Button icon="pen" type="flat" onClick={() => onEdit(item)} />
              <Button icon="trash" type="flat" onClick={() => onDelete(item)} />
            </div>
          </div>
        )
      })
    }
  }

  render() {
    const { onAdd } = this.props
    return (
      <div className={styles.cardWrapper}>
        {this.renderContent()}
        <div className={styles.empty} onClick={onAdd}>
          <span className={styles.icon}></span>
          <span>{t('Add New Subdepartment')}</span>
        </div>
      </div>
    )
  }
}
