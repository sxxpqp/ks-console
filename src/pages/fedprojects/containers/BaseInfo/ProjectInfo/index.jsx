import React from 'react'
import { get, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { Button, Icon, Menu, Dropdown } from '@kube-design/components'
import { getLocalTime, getDisplayName } from 'utils'
import { Panel } from 'components/Base'

import styles from './index.scss'

export default class ProjectInfo extends React.Component {
  renderMoreMenu() {
    const { actions, onMenuClick } = this.props

    return (
      <Menu onClick={onMenuClick}>
        {actions.map(action => (
          <Menu.MenuItem key={action.key}>
            <Icon name={action.icon} /> {action.text}
          </Menu.MenuItem>
        ))}
      </Menu>
    )
  }

  render() {
    const { detail, workspace, actions } = this.props
    return (
      <Panel className={styles.wrapper} title={t('Project Info')}>
        <div className={styles.header}>
          <Icon name="project" size={40} />
          <div className={styles.item}>
            <div>{getDisplayName(detail)}</div>
            <p>{t('Project Name')}</p>
          </div>
          <div className={styles.item}>
            <div>
              <Link to={`/workspaces/${workspace}`}>{workspace}</Link>
            </div>
            <p>{t('Workspace')}</p>
          </div>
          <div className={styles.item}>
            <div>{get(detail, 'creator') || '-'}</div>
            <p>{t('Creator')}</p>
          </div>
          <div className={styles.item}>
            <div>
              {getLocalTime(detail.createTime).format(`YYYY-MM-DD HH:mm:ss`)}
            </div>
            <p>{t('Created Time')}</p>
          </div>
          {!isEmpty(actions) && (
            <div className={classNames(styles.item, 'text-right')}>
              <Dropdown
                theme="dark"
                content={this.renderMoreMenu()}
                trigger="click"
                placement="bottomRight"
              >
                <Button>{t('Manage Project')}</Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Panel>
    )
  }
}
