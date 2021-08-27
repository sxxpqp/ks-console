import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { get, isEmpty, isUndefined } from 'lodash'

import { getAreaChartOps } from 'utils/monitoring'

import { Text } from 'components/Base'

import { SimpleArea } from 'components/Charts'

import styles from './index.scss'

export default class MonitorTab extends React.Component {
  static propTypes = {
    tabs: PropTypes.array,
  }

  static defaultProps = {
    tabs: [],
  }

  state = {
    activeTab: get(this, 'props.tabs[0].key', ''),
  }

  handleTabClick = e =>
    this.setState({ activeTab: e.currentTarget.dataset.key })

  renderTabList() {
    const { tabs } = this.props
    const { activeTab } = this.state

    if (isEmpty(tabs)) return null

    return (
      <div className={styles.tabHeader}>
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={classnames(styles.tabHeaderItem, {
              [styles.active]: tab.key === activeTab,
            })}
            data-key={tab.key}
            onClick={this.handleTabClick}
          >
            <Text
              icon={tab.icon}
              title={
                !tab.data || isUndefined(tab.titleValue)
                  ? '-'
                  : `${tab.titleValue} ${tab.unit}`
              }
              description={tab.title}
            />
          </div>
        ))}
      </div>
    )
  }

  renderTabContent() {
    const { tabs } = this.props
    const { activeTab } = this.state

    const tab = tabs.find(_tab => _tab.key === activeTab)

    if (!tab || !tab.data) {
      return null
    }

    const config = getAreaChartOps(tab)

    return (
      <div className={styles.tabContent}>
        <SimpleArea
          width="100%"
          height={200}
          yAxis={{
            hide: true,
            domain: [0, 100],
          }}
          {...config}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.wrapper}>
        {this.renderTabList()}
        {this.renderTabContent()}
      </div>
    )
  }
}
