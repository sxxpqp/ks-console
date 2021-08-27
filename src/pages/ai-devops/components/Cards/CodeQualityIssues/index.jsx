import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Card } from 'components/Base'
import { parseUrl } from 'utils'

import Issue from './issue'
import Status from './ClassIcon'
import styles from './index.scss'

class CodeQualityIssues extends React.Component {
  static propTypes = {
    issues: PropTypes.array,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    issues: [],
  }

  get sonarqubeOrigin() {
    const { sonarqubeDashboardUrl } = this.props.detail

    return (
      get(globals, 'config.devops.sonarqubeURL') ||
      parseUrl(sonarqubeDashboardUrl).origin
    )
  }

  constructor(props) {
    super(props)
    const showMore = props.issues.length <= 10
    this.state = {
      showMore,
    }
  }

  showMore = () => {
    this.setState({ showMore: true })
  }

  renderTitle = () => {
    const { critical, major, minor, info, blocker } = this.props.detail
    return (
      <div className={styles.header}>
        <span className={styles.title}>{t('Issues')}</span>
        <div className={styles.details}>
          <span>
            <Status errorClass="blocker" />
            {blocker || 0}
          </span>
          <span>
            <Status errorClass="critical" />
            {critical || 0}
          </span>
          <span>
            <Status errorClass="major" />
            {major || 0}
          </span>
          <span>
            <Status errorClass="minor" />
            {minor || 0}
          </span>
          <span>
            <Status errorClass="info" />
            {info || 0}
          </span>
        </div>
      </div>
    )
  }

  renderIssue = (issue, index) => {
    const { issues } = this.props
    if (this.state.showMore && index > 10) {
      return null
    }
    const hasTitle =
      index === 0 || issue.component !== issues[index - 1].component
    return (
      <Issue
        key={index}
        hasTitle={hasTitle}
        issue={issue}
        origin={this.sonarqubeOrigin}
      />
    )
  }

  renderMoreBtn = () => {
    if (this.state.showMore) {
      return null
    }
    return (
      <p className={styles.titleShowMore}>
        {t('Show only the last 10')},
        <span onClick={this.showMore}>{t('Display All')}</span>
      </p>
    )
  }

  render() {
    const { loading, issues } = this.props

    if (loading) {
      return null
    }

    if (!issues.length) {
      return null
    }

    return (
      <Card title={this.renderTitle()} operations={this.renderMoreBtn()}>
        <div className={styles.content}>
          {issues.map((issue, index) => this.renderIssue(issue, index))}
          {!this.state.showMore ? (
            <div className={styles.displayAll} onClick={this.showMore}>
              {t('Display All')}
            </div>
          ) : null}
        </div>
      </Card>
    )
  }
}

export default CodeQualityIssues
