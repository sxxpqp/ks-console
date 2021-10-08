import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import { Icon } from '@kube-design/components'
import { Card } from 'components/Base'

import styles from './index.scss'

export default class ContainerItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    detail: PropTypes.object,
    expand: PropTypes.bool,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    detail: {},
    expand: false,
    loading: true,
  }

  state = {
    isExpand: this.props.expand,
    defaultExpand: this.props.expand,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.expand !== state.defaultExpand) {
      return {
        isExpand: props.expand,
        defaultExpand: props.expand,
      }
    }

    return null
  }

  handleExpand = () => {
    this.setState({
      isExpand: !this.state.isExpand,
    })
  }

  renderTitle() {
    const { type, name } = this.props.detail
    return (
      <div className={styles.title}>
        <Icon name="docker" size={20} />
        {type === 'init' ? t('Init Container') : t('Container')}: {name}
      </div>
    )
  }

  renderOperations() {
    return (
      <div className={styles.arrow}>
        <Icon name="caret-down" size={12} type="light" />
      </div>
    )
  }

  renderContent() {
    const { variables } = this.props.detail

    if (isEmpty(variables)) return null

    return (
      <div
        className={styles.content}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <ul className={styles.variables}>
          {variables.map(({ name, value }) => (
            <li key={name}>
              <div className={styles.name}>{name}</div>
              <div>{value}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <Card
        className={classnames(styles.main, {
          [styles.expanded]: this.state.isExpand,
        })}
        title={this.renderTitle()}
        operations={this.renderOperations()}
        empty={t('NOT_AVAILABLE', { resource: t('environment variables') })}
        loading={this.props.loading}
        onClick={this.handleExpand}
      >
        {this.renderContent()}
      </Card>
    )
  }
}
