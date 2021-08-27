import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'components/Base'

import Item from './Item'

import styles from './index.scss'

export default class ServiceComponents extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    data: {},
    onAdd() {},
    onDelete() {},
  }

  handleAdd = () => {
    this.props.onAdd()
  }

  renderContent() {
    const { data, clusters, onAdd, onDelete } = this.props
    return (
      <div>
        {Object.keys(data).map(key => (
          <Item
            key={key}
            data={data[key]}
            clusters={clusters}
            propsKey={key}
            onEdit={onAdd}
            onDelete={onDelete}
          />
        ))}
        <div className={styles.add} onClick={this.handleAdd}>
          <Text
            title={t('Add Service')}
            description={t('Add stateful or stateless services')}
          />
        </div>
      </div>
    )
  }

  render() {
    const { error } = this.props

    return (
      <div className={styles.wrapper}>
        {this.renderContent()}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    )
  }
}
