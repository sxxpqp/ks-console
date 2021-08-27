import { isEmpty } from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Loading } from '@kube-design/components'
import EmptyList from 'components/Cards/EmptyList'
import Graph from 'components/Graph'

import styles from './index.scss'

@inject('detailStore')
@observer
class TrafficManangement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isGraphLoading: true,
    }

    this.store = props.detailStore
    this.module = props.module
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.getData()
    }, 10000)

    this.getData()
  }

  componentWillUnmount() {
    this.unmount = true
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  getData() {
    const { cluster, namespace, name } = this.props.match.params

    this.setState({ isGraphLoading: true })
    this.store.fetchGraph({ cluster, namespace, app: name }).then(() => {
      if (!this.unmount) {
        this.setState({ isGraphLoading: false })
      }
    })
  }

  handleRefresh = () => {
    this.getData()
  }

  render() {
    const { isGraphLoading } = this.state
    const { data, health } = this.store.graph

    if (!isEmpty(data) && !isEmpty(data.nodes)) {
      return (
        <div className={styles.main}>
          <Graph
            data={data}
            health={health}
            store={this.store}
            loading={isGraphLoading}
            onFetch={this.handleRefresh}
          />
        </div>
      )
    }

    if (isGraphLoading) {
      return <Loading className={styles.loading} />
    }

    return (
      <EmptyList
        image="/assets/traffic-management.svg"
        title={t('Temporarily unable to use traffic management')}
        desc={t(
          'The app has not received the request for a long time, please visit the app and try traffic management'
        )}
        actions={<Button onClick={this.handleRefresh}>{t('Refresh')}</Button>}
      />
    )
  }
}

export default TrafficManangement
