import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { capitalize } from 'lodash'

import { transferVersionStatus } from 'utils/app'
import { STATUS_TO_ICON } from 'configs/openpitrix/version'

import styles from './index.scss'

export default class VersionStatus extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    noIcon: PropTypes.bool,
    noName: PropTypes.bool,
  }

  static defaultProps = {
    type: '',
    name: '',
    noIcon: false,
    noName: false,
  }

  renderIcon() {
    const { type } = this.props
    const iconType = STATUS_TO_ICON[type] || type

    if (iconType === 'draft') {
      return <label className={styles.draft} />
    }

    if (iconType === 'review') {
      return <label className={styles.review} />
    }

    if (iconType === 'passed') {
      return <Icon size={16} name="success" className={styles.passed} />
    }

    if (iconType === 'suspended') {
      return (
        <label className={styles.suspended}>
          <Icon size={13} name="substract" className={styles.substract} />
        </label>
      )
    }

    if (iconType === 'deleted') {
      return <Icon size={16} name="error" className={styles.deleted} />
    }

    return <label className={styles.review} />
  }

  render() {
    const { className, name, type, noIcon, noName } = this.props
    const statusName = transferVersionStatus(name || type)

    return (
      <span className={classNames(styles.status, className)}>
        {!noIcon && <label className={styles.icon}>{this.renderIcon()}</label>}
        {!noName && (
          <label className={styles.name}>{t(capitalize(statusName))}</label>
        )}
      </span>
    )
  }
}
