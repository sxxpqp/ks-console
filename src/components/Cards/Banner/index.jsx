import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Icon } from '@kube-design/components'
import classnames from 'classnames'

// import { getDocsUrl } from 'utils'
import { ICON_TYPES } from 'utils/constants'

import Tip from './Tip'
import Navs from './Navs'
import Tabs from './Tabs'

import styles from './index.scss'

export default class Banner extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    module: PropTypes.string,
    tips: PropTypes.array,
    routes: PropTypes.array,
    tabs: PropTypes.object,
    extra: PropTypes.node,
  }

  static defaultProps = {
    tips: [],
    tabs: {},
    routes: [],
  }

  state = {
    openTip: '',
  }

  handleToggle = title => {
    this.setState(({ openTip }) => ({
      openTip: openTip === title ? '' : title,
    }))
  }

  get hiddenTips() {
    return (
      localStorage.getItem(`${globals.user.username}-banner-tips`) || ''
    ).split(',')
  }

  handleClose = key => {
    if (!this.hiddenTips.includes(key)) {
      localStorage.setItem(
        `${globals.user.username}-banner-tips`,
        [...this.hiddenTips, key].join(',')
      )

      this.forceUpdate()
    }
  }

  renderTips(tips) {
    return (
      <div className={styles.tips}>
        {tips
          .filter(tip => !this.hiddenTips.includes(tip.title))
          .map((tip, index) => (
            <Tip
              key={index}
              {...tip}
              onClose={this.handleClose}
              onToggle={this.handleToggle}
              open={tip.title === this.state.openTip}
            />
          ))}
      </div>
    )
  }

  render() {
    const {
      className,
      title,
      description,
      icon,
      module,
      tips,
      tabs,
      extra,
      routes,
    } = this.props
    // const docUrl = getDocsUrl(module)
    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.titleWrapper}>
          <div className={styles.icon}>
            <Icon name={icon || ICON_TYPES[module] || 'catalog'} size={48} />
          </div>
          <div className={styles.title}>
            <div className="h3">{title}</div>
            <p className="text-second">
              {description}
              {/* {docUrl && (
                <span className={styles.more}>
                  <Icon name="documentation" size={20} />
                  <a href={docUrl} target="_blank" rel="noreferrer noopener">
                    {t('Learn more')}
                  </a>
                </span>
              )} */}
            </p>
          </div>
        </div>
        {!isEmpty(routes) && <Navs routes={routes} />}
        {!isEmpty(tabs) && <Tabs tabs={tabs} />}
        {extra}
        {!isEmpty(tips) && this.renderTips(tips)}
      </div>
    )
  }
}
