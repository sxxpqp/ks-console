import React from 'react'

import Project from './Project'

import styles from './index.scss'

class UsageRanking extends React.Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <Project cluster={this.props.match.params.cluster} />
      </div>
    )
  }
}

export default UsageRanking
