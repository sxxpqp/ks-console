import React, { Component } from 'react'
import { highlightPromql } from 'components/Modals/CustomMonitoring/components/PromQLInput/promql'
import styles from './index.scss'

export default class Query extends Component {
  state = {
    html: highlightPromql(this.props.query),
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.setState({ html: highlightPromql(this.props.query) })
    }
  }

  render() {
    return (
      <div
        className={styles.query}
        dangerouslySetInnerHTML={{
          __html: this.state.html,
        }}
      />
    )
  }
}
