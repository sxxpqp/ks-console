import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import CodeQualityResult from 'devops/components/Cards/CodeQualityResult'
import CodeQualityIssues from 'devops/components/Cards/CodeQualityIssues'

@inject('rootStore', 'sonarqubeStore')
@observer
export default class CodeQuality extends React.Component {
  componentDidMount() {
    const { detail = {}, isLoading } = this.props.sonarqubeStore

    if (!detail.totalStatus && !isLoading) {
      this.props.rootStore.routing.push('./activity')
    }
  }

  renderResult = () => {
    const { detail = {}, isLoading } = this.props.sonarqubeStore

    return <CodeQualityResult detail={detail} loading={isLoading} />
  }

  renderIssues = () => {
    const { detail = {}, isLoading } = this.props.sonarqubeStore

    return (
      <CodeQualityIssues
        detail={detail}
        issues={toJS(detail.issues)}
        loading={isLoading}
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderResult()}
        {this.renderIssues()}
      </div>
    )
  }
}
