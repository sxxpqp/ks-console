import { get } from 'lodash'
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import { Icon, Tag } from '@kube-design/components'
import { Indicator } from 'components/Base'
import StatusReason from 'clusters/components/StatusReason'
import { CLUSTER_PROVIDER_ICON, CLUSTER_GROUP_TAG_TYPE } from 'utils/constants'

import styles from './index.scss'

export default class ClusterTitle extends Component {
  static propTypes = {
    theme: PropTypes.oneOf(['dark', 'light']),
    size: PropTypes.oneOf(['normal', 'small', 'large']),
  }

  static defaultProps = {
    theme: 'dark',
    size: 'normal',
  }

  iconSizeMap = {
    large: 48,
    normal: 40,
    small: 20,
  }

  render() {
    const {
      theme,
      size,
      className,
      cluster,
      tagClass,
      noStatus,
      onClick,
    } = this.props

    if (!cluster) {
      return null
    }

    const isReady = get(cluster.conditions, 'Ready.status') === 'True'

    const sizeVal = this.iconSizeMap[size]

    return (
      <div
        className={classNames(
          styles.wrapper,
          styles[theme],
          styles[size],
          className
        )}
      >
        <div className={styles.icon} style={{ height: sizeVal }}>
          <Icon
            name={CLUSTER_PROVIDER_ICON[cluster.provider] || 'kubernetes'}
            size={sizeVal}
            type={theme}
          />
          {!noStatus && isReady && (
            <Indicator className={styles.indicator} status="ready" />
          )}
        </div>
        <div className={styles.title}>
          <div className={styles.name}>
            {onClick ? (
              <a title={cluster.name} onClick={onClick}>
                {cluster.name}
              </a>
            ) : (
              <span title={cluster.name}>{cluster.name}</span>
            )}
            {cluster.group && (
              <Tag
                className={classNames('margin-l12', tagClass)}
                type={CLUSTER_GROUP_TAG_TYPE[cluster.group]}
              >
                {t(`ENV_${cluster.group.toUpperCase()}`, {
                  defaultValue: cluster.group,
                })}
              </Tag>
            )}
            {cluster.isHost && (
              <Tag
                className={classNames('margin-l12', tagClass)}
                type="warning"
              >
                {t('Host Cluster')}
              </Tag>
            )}
            &nbsp;
            {size === 'small' && !noStatus && !isReady && (
              <StatusReason data={cluster} />
            )}
          </div>
          <div className={styles.description}>
            {isReady || noStatus ? (
              <p className="ellipsis">{cluster.description || '-'}</p>
            ) : (
              <StatusReason data={cluster} />
            )}
          </div>
        </div>
      </div>
    )
  }
}
