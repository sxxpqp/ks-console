import React from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@kube-design/components'
import classnames from 'classnames'
import noop from 'lodash/noop'
import { Link } from 'react-router-dom'
import AppCard from 'components/Cards/App'
import { stringify } from 'qs'

import styles from './index.scss'

export default class AppList extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     current: '',
  //   }
  // }

  static propTypes = {
    apps: PropTypes.array,
    isLoading: PropTypes.bool,
    total: PropTypes.number,
    onFetchMore: PropTypes.func,
    itemCls: PropTypes.string,
    title: PropTypes.string,
    disableLink: PropTypes.bool,
    onClickAppItem: PropTypes.func,
  }

  static defaultProps = {
    apps: [],
    isLoading: false,
    total: 0,
    onFetchMore: noop,
    disableLink: false,
  }

  renderApps() {
    const {
      workspace,
      cluster,
      namespace,
      apps,
      isLoading,
      itemCls,
      disableLink,
      onClickAppItem,
      defaultApp,
    } = this.props
    if (apps.length === 0 && !isLoading) {
      return (
        <div className={styles.noApp}>
          <img src="/assets/empty-card.svg" alt="" />
          <p>{t('RESOURCE_NOT_FOUND')}</p>
        </div>
      )
    }

    const query = stringify({ workspace, cluster, namespace })

    const onClick = app => {
      this.setState({
        defaultApp: app.app_id,
      })
      onClickAppItem(app)
    }

    return (
      <>
        {apps.map(app => {
          const link = `/apps/${app.app_id}?${query}`
          if (disableLink && onClickAppItem) {
            return (
              <div
                key={app.app_id}
                className={classnames(
                  styles.appItem,
                  itemCls,
                  defaultApp === app.app_id ? styles.active : ''
                )}
                onClick={() => onClick(app)}
              >
                <AppCard active={defaultApp === app.app_id} app={app} />
              </div>
            )
          }

          return (
            <Link
              key={app.app_id}
              className={classnames(styles.appItem, itemCls)}
              to={link}
            >
              <AppCard app={app} />
            </Link>
          )
        })}
      </>
    )
  }

  render() {
    const {
      apps,
      isLoading,
      total,
      onFetchMore,
      title,
      className,
      appRef,
    } = this.props
    return (
      <div className={classnames(styles.appList, className)} ref={appRef}>
        {title && <p className="apps-title">{title}</p>}
        {this.renderApps()}
        {isLoading && (
          <div className={styles.loading}>
            <Loading />
          </div>
        )}
        {!isLoading && apps.length < total && (
          <a className={styles.loadMore} onClick={onFetchMore}>
            <span>{t('Load More')}</span>
          </a>
        )}
      </div>
    )
  }
}
