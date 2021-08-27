import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Icon } from '@kube-design/components'

import { Card } from 'components/Base'

import Item from './Item'

import styles from './index.scss'

export default class TracingCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    loading: PropTypes.bool,
    operations: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]),
    onItemClick: PropTypes.func,
  }

  static defaultProps = {
    prefix: '',
    data: [],
    onItemClick() {},
    loading: false,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.loading !== this.props.loading
  }

  renderContent() {
    const { data, onItemClick } = this.props

    if (isEmpty(data)) return null

    return (
      <div className={styles.cardContent}>
        {data.map(item => (
          <Item key={item.traceID} detail={item} onClick={onItemClick} />
        ))}
      </div>
    )
  }

  renderEmpty() {
    return (
      <div className={styles.empty}>
        <div>
          <div className={styles.icon}>
            <Icon name="target" size={40} />
          </div>
          <p>
            <strong>{t('No result found')}</strong>
          </p>
          <p>{t('Please try other query conditions')}</p>
        </div>
      </div>
    )
  }

  renderHeader() {
    const { operations } = this.props

    return (
      <div className={styles.cardHeader}>
        {operations && <div className={styles.operations}>{operations}</div>}
        {t('Tracing')}
      </div>
    )
  }

  render() {
    const { loading } = this.props

    return (
      <Card
        className={styles.tracing}
        header={this.renderHeader()}
        empty={this.renderEmpty()}
        loading={loading}
      >
        {this.renderContent()}
      </Card>
    )
  }
}
