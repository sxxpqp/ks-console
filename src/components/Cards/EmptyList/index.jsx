import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Icon } from '@kube-design/components'

import styles from './index.scss'

export default class EmptyList extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    actions: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  }

  static defaultProps = {
    icon: 'appcenter',
  }

  render() {
    const { image, icon, title, desc, actions, className } = this.props

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.image}>
          {image ? <img src={image} alt="" /> : <Icon name={icon} size={48} />}
        </div>
        <div className={styles.title}>{title}</div>
        <p className={styles.desc}>{desc}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    )
  }
}
