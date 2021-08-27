import React, { Component } from 'react'
import { Text } from 'components/Base'

import styles from './index.scss'

export default class Resource extends Component {
  handleClick = () => {
    const { data, onClick } = this.props
    onClick(data.link)
  }

  render() {
    const { data, count } = this.props
    return (
      <div key={data.name} className={styles.resource}>
        <Text
          icon={data.icon}
          title={count || 0}
          description={t(data.name)}
          onClick={data.link ? this.handleClick : null}
        />
      </div>
    )
  }
}
