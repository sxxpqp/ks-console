import React, { Component } from 'react'
import { toJS } from 'mobx'
import { isEmpty } from 'lodash'
import { observer, inject } from 'mobx-react'
import { NavLink } from 'react-router-dom'
import { Columns, Column } from '@kube-design/components'

import Health from 'devops/components/Health'
import { ReactComponent as ForkIcon } from 'assets/fork.svg'

import styles from './index.scss'

class Nav extends Component {
  static defaultProps = {
    module: '',
  }

  get enabledActions() {
    const { cluster, devops } = this.props.match.params

    return globals.app.getActions({
      module: 'pipelines',
      cluster,
      devops,
    })
  }

  get isMultibranch() {
    const { detailStore } = this.props
    const scmSource = toJS(detailStore.detail.scmSource)
    return !isEmpty(scmSource)
  }

  renderBaseInfo() {
    const { detail } = this.props.detailStore

    return (
      <Columns className={styles.baseInfo}>
        <Column className={styles.baseInfo__item}>
          <div className={styles.dashboardValue}>
            <Health score={detail.weatherScore} />
          </div>
          <div className={styles.dashboardLable}>{t('Health Status')}</div>
        </Column>
        <Column className={styles.baseInfo__item}>
          <div className={styles.dashboardValue}>
            <ForkIcon style={{ width: '20px', height: '20px' }} />{' '}
            {detail.totalNumberOfBranches || '-'}
          </div>
          <div className={styles.dashboardLable}>{t('Branch Count')}</div>
        </Column>
        <Column className={styles.baseInfo__item} />
      </Columns>
    )
  }

  renderNavLink(item) {
    const { name, title } = item
    const { detailStore, sonarqubeStore } = this.props
    const showPipelineConfig = this.enabledActions.includes('edit')

    if (!name) return null
    if (detailStore && sonarqubeStore) {
      if ((!showPipelineConfig || this.isMultibranch) && name === 'pipeline') {
        return null
      }
      if (!sonarqubeStore.detail.totalStatus && name === 'code-quality') {
        return null
      }
      if (!this.isMultibranch && name === 'branch') {
        return null
      }
      if (
        !detailStore.detail.totalNumberOfPullRequests &&
        name === 'pull-request'
      ) {
        return null
      }
    }

    return (
      <NavLink
        key={name}
        className={styles.navItem}
        activeClassName={styles.active}
        to={`${this.props.match.url}/${name}`}
      >
        {t(title)}
      </NavLink>
    )
  }

  render() {
    const { route } = this.props
    return (
      <React.Fragment>
        {this.renderBaseInfo()}
        <div className={styles.nav}>
          {route.routes.map(item => this.renderNavLink(item))}
        </div>
      </React.Fragment>
    )
  }
}

export default inject('rootStore')(observer(Nav))
