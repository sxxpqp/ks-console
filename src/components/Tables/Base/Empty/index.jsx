import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isUndefined } from 'lodash'

import { Icon } from '@kube-design/components'

import { ICON_TYPES } from 'utils/constants'

import styles from './index.scss'

export default class EmptyTable extends React.PureComponent {
  static propTypes = {
    module: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    className: PropTypes.string,
    action: PropTypes.node,
  }

  static defaultProps = {
    name: '',
    module: '',
  }

  render() {
    const { module, icon, title, name, desc, action, className } = this.props
    const _desc = !isUndefined(desc)
      ? desc
      : t.html(
          `${name
            .split(' ')
            .join('_')
            .toUpperCase()}_CREATE_DESC`
        )

    const _icon = icon || ICON_TYPES[module] || 'appcenter'

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.image}>
          <Icon name={_icon} size={48} />
        </div>
        <div className={styles.title}>
          {title || t('EMPTY_WRAPPER', { resource: t(name) })}
        </div>
        <p className={styles.desc}>{_desc}</p>
        {action && <div className={styles.actions}>{action}</div>}
      </div>
    )
  }
}
