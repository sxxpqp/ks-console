import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isFunction } from 'lodash'

import { Icon, Tooltip } from '@kube-design/components'
import { getAreaChartOps } from 'utils/monitoring'

import TinyArea from '../TinyArea'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class ResourceCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    name: PropTypes.string,
    namespace: PropTypes.string,
    routeName: PropTypes.string,
    num: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    warnNum: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    icon: 'appcenter',
    iconSize: 40,
    name: 'deployment',
    namespace: 'default',
    routeName: '',
    num: 0,
    warnNum: 0,
  }

  get routing() {
    return this.props.rootStore.routing
  }

  handleClick = () => {
    const {
      onClick,
      name,
      routeName,
      workspace,
      namespace,
      cluster,
    } = this.props
    if (isFunction(onClick)) {
      onClick(name)
    } else if (routeName) {
      this.routing.push(
        workspace
          ? `/${workspace}/clusters/${cluster}/projects/${namespace}/${routeName}`
          : `/clusters/${cluster}/${routeName}?namespace=${namespace}`
      )
    }
  }

  handleWarnClick = e => {
    e.stopPropagation()

    const {
      routeName,
      onClick,
      name,
      workspace,
      namespace,
      cluster,
    } = this.props
    const status = routeName === 'volumes' ? 'pending' : 'updating'

    if (isFunction(onClick)) {
      onClick(name, status)
    } else if (routeName) {
      this.routing.push(
        workspace
          ? `/${workspace}/clusters/${cluster}/projects/${namespace}/${routeName}?status=${status}`
          : `/clusters/${cluster}/${routeName}?status=${status}`
      )
    }
  }

  renderWarn() {
    const { warnNum, name } = this.props
    const warnText =
      warnNum > 99 ? <div className={styles.skip}>...</div> : warnNum

    if (warnNum > 0) {
      return (
        <div className={styles.warn}>
          <Tooltip
            className={styles.tips}
            content={t('RESOURCE_WARNING_TIPS', {
              warnNum,
              tipName: t(name),
            })}
          >
            <div onClick={this.handleWarnClick}>{warnText}</div>
          </Tooltip>
        </div>
      )
    }
    return null
  }

  render() {
    const {
      className,
      icon,
      iconSize,
      name,
      routeName,
      num,
      metrics,
      onClick,
    } = this.props

    const config = getAreaChartOps({
      title: '',
      unit: '',
      legend: ['Count'],
      data: metrics,
    })

    return (
      <div data-name={name} className={classnames(styles.card, className)}>
        <div className={styles.icon}>
          <Icon name={icon} size={iconSize} />
          {this.renderWarn()}
        </div>
        <div
          className={classnames(styles.info, {
            [styles.cursor]: routeName || onClick,
          })}
          onClick={this.handleClick}
        >
          <strong>{num}</strong>
          <span>{t(name)}</span>
        </div>
        <TinyArea width={330} height={44} bgColor="transparent" {...config} />
      </div>
    )
  }
}
