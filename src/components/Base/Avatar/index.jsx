import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Icon, Tooltip } from '@kube-design/components'

import { inject } from 'mobx-react'
import styles from './index.scss'

@inject('rootStore')
export default class Avatar extends React.Component {
  static propTypes = {
    avatar: PropTypes.string,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    to: PropTypes.string,
  }

  static defaultProps = {
    iconSize: 20,
  }

  // constructor(props) {
  //   super(props)
  //   console.log(this.props.rootStore)
  // }

  get location() {
    return this.props.rootStore.routing.location
  }

  renderClusterTip() {
    return (
      <div>
        <div className="tooltip-title">{t('Multi-cluster Deployment')}</div>
        <p>{t('MULTI_CLUSTER_TIP')}</p>
      </div>
    )
  }

  render() {
    const {
      className,
      avatar,
      icon,
      iconSize,
      title,
      desc,
      to,
      noLink,
      isMultiCluster,
    } = this.props

    const titleComponent = to ? (
      <Link to={{ pathname: to, state: { prevPath: this.location.pathname } }}>
        {title}
      </Link>
    ) : (
      title
    )

    return (
      <div
        className={classNames(styles.wrapper, className, {
          [styles.link]: noLink || to,
        })}
      >
        {avatar ? (
          <img
            className={styles.image}
            src={avatar || '/assets/default-user.svg'}
            alt=""
          />
        ) : (
          icon && <Icon className={styles.icon} name={icon} size={iconSize} />
        )}
        {(avatar || icon) && isMultiCluster && (
          <Tooltip content={this.renderClusterTip()}>
            <img className={styles.indicator} src="/assets/cluster.svg" />
          </Tooltip>
        )}
        <div className={styles.text}>
          <div className={styles.title}>{titleComponent}</div>
          <div className={classNames(styles.description, 'ks-avatar-desc')}>
            {desc}
          </div>
        </div>
      </div>
    )
  }
}
