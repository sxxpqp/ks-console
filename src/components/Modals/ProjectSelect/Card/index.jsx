import React from 'react'
import classNames from 'classnames'
import { List } from 'components/Base'
import { getLocalTime, getDisplayName } from 'utils'

import styles from './index.scss'

export default class ProjectCard extends React.Component {
  handleClick = () => {
    const { onEnter, data } = this.props
    if (data.status === 'Terminating') {
      return
    }

    onEnter && onEnter(data)
  }

  render() {
    const { type, data } = this.props

    let name
    let desc
    let icon
    let admin
    let createTime
    if (type === 'devops') {
      name = data.name
      desc = data.description || '-'
      admin = data.creator
      createTime = data.create_time
      icon = 'strategy-group'
    } else {
      name = getDisplayName(data)
      desc = data.description || '-'
      admin = data.creator
      createTime = data.createTime
      icon = 'project'
    }

    const isTerminating = data.status === 'Terminating'
    name = (
      <div className={styles.name}>{isTerminating ? name : <a>{name}</a>}</div>
    )

    desc = isTerminating ? t(data.status) : desc

    const details = [
      { title: admin || '-', description: t('Creator') },
      {
        title: getLocalTime(createTime).format('YYYY-MM-DD HH:mm:ss'),
        description: t('Created Time'),
      },
    ]

    return (
      <List.Item
        className={classNames(styles.wrapper, {
          [styles.disabled]: isTerminating,
        })}
        icon={icon}
        title={name}
        description={desc}
        details={details}
        onClick={this.handleClick}
      />
    )
  }
}
