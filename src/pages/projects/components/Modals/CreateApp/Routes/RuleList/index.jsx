import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { Text } from 'components/Base'
import Item from 'components/Forms/Route/RouteRules/RuleList/Item'

import styles from './index.scss'

export default class RuleList extends React.Component {
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
    const { data, onAdd, onDelete, projectDetail } = this.props

    const rules = get(data, 'spec.rules', [])
    const tls = get(data, 'spec.tls', [])

    return (
      <ul>
        {rules
          .filter(item => item.host)
          .map((rule, index) => (
            <Item
              key={`${rule.host}-${index}`}
              rule={rule}
              tls={tls}
              index={index}
              onEdit={onAdd}
              onDelete={onDelete}
              projectDetail={projectDetail}
            />
          ))}
        <div className={styles.add} onClick={this.handleAdd}>
          <Text
            title={t('Add Route Rule')}
            description={t('Add an Internet access rule for the application')}
          />
        </div>
      </ul>
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
