import React from 'react'
import { omit } from 'lodash'
import { List } from 'components/Base'

import styles from './index.scss'

export default class SecretDataList extends React.Component {
  static defaultProps = {
    value: {},
  }

  handleDelete = key => () => {
    const { value, onChange } = this.props
    onChange(omit(value, key))
  }

  handleEdit = key => () => {
    const { onEdit } = this.props
    onEdit(key)
  }

  renderContent() {
    const { value, onAdd } = this.props

    return (
      <List>
        {Object.entries(value).map(([key, _value]) => (
          <List.Item
            key={key}
            icon="hammer"
            title={key}
            description={_value || '-'}
            onDelete={this.handleDelete(key)}
            onEdit={this.handleEdit(key)}
          />
        ))}
        <List.Add
          title={t('Add Data')}
          description={t('Add key / value pair data')}
          onClick={onAdd}
        />
      </List>
    )
  }

  render() {
    return <div className={styles.wrapper}>{this.renderContent()}</div>
  }
}
