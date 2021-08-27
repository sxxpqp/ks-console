import React from 'react'
import { withRouter } from 'react-router'

import RadioGroup from './RadioGroup'

import styles from './index.scss'

@withRouter
export default class Navs extends React.Component {
  render() {
    const { routes, match, history } = this.props

    const tabs = routes
      .filter(route => !!route.name)
      .map(route => ({
        label: t(route.title),
        value: route.name,
        count: route.count,
      }))

    const matchTab =
      tabs.find(tab =>
        location.pathname.startsWith(`${match.url}/${tab.value}`)
      ) || {}

    const handleChange = value => history.push(`${match.url}/${value}`)

    return (
      <div className={styles.tabsWrapper}>
        <RadioGroup
          value={matchTab.value}
          onChange={handleChange}
          options={tabs}
        />
      </div>
    )
  }
}
