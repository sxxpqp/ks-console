import React from 'react'
import { get } from 'lodash'
import { Loading, Select } from '@kube-design/components'

import { Panel } from 'components/Base'
import BuilderStore from 'stores/s2i/builder'
import RunStore from 'stores/s2i/run'
import MAPPER from 'utils/object.mapper'

import BuilderInfo from './BuilderInfo'
import RerunModal from './RerunModal'
import Log from './log'
import styles from './index.scss'

export default class S2IBuilder extends React.Component {
  constructor(props) {
    super(props)
    const { builderNames } = props
    this.state = {
      builderDetail: {},
      runDetail: {},
      getRunDetailLoading: true,
      currentBuilderName: builderNames[0],
      showRerun: false,
      notFound: false,
    }
    this.refreshTimer = null
    this.builderStore = new BuilderStore()
    this.runStore = new RunStore()
  }

  static defaultProps = {
    builderNames: [],
  }

  get cluster() {
    return this.props.cluster
  }

  componentDidMount() {
    const { builderNames } = this.props
    this.fetchData(builderNames[0])
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimer)
  }

  showRerun = () => {
    this.setState({ showRerun: true })
  }

  hideRerun = () => {
    this.setState({ showRerun: false })
  }

  handleCurrentBuilderChange = value => {
    this.setState({
      currentBuilderName: value,
      builderDetail: {},
      runDetail: {},
    })
    this.fetchData(value)
  }

  fetchData = async builderName => {
    const result = await this.getBuilderDetail(builderName)
    const lastRunName = get(result, 'status.lastRunName')
    if (lastRunName) {
      this.getRunDetail(lastRunName)
    }
  }

  getBuilderDetail = async builderName => {
    const { namespace } = this.props
    const result = await this.builderStore.fetchDetail({
      cluster: this.cluster,
      name: builderName,
      namespace,
    })

    if (get(result, '_originData.reason', '') === 'NotFound') {
      this.setState({ notFound: true })
      return
    }
    this.setState({ builderDetail: result })
    return result
  }

  getRunDetail = async runName => {
    const { namespace } = this.props
    this.setState({ getRunDetailLoading: true })
    clearTimeout(this.refreshTimer)
    const lastRunName = get(this.state.builderDetail, 'status.lastRunName')

    const result = await this.runStore.fetchRunDetail({
      namespace,
      runName: runName || lastRunName,
    })

    const runState = get(result, 'status', '')

    if (runState === 'running') {
      this.refreshTimer = setTimeout(this.getRunDetail, 4000)
    }
    this.setState({ runDetail: result, getRunDetailLoading: false })
  }

  handleRerun = async ({ newTag, isUpdateWorkload }) => {
    const { namespace } = this.props
    const { currentBuilderName } = this.state
    clearTimeout(this.refreshTimer)

    const result = await this.builderStore.rerun({
      cluster: this.cluster,
      newTag,
      name: currentBuilderName,
      namespace,
      isUpdateWorkload,
    })

    this.setState({
      runDetail: MAPPER.s2iruns(result),
      getRunDetailLoading: false,
      showRerun: false,
    })

    // detail status not update immediately
    setTimeout(() => {
      this.fetchData(currentBuilderName)
    }, 1000)
  }

  renderBuilderSelect = () => {
    const { builderNames } = this.props
    if (builderNames.length === 1) {
      return null
    }
    const options = builderNames.map(name => ({
      label: name,
      value: name,
    }))
    return (
      <Select
        className={styles.builderSelector}
        onChange={this.handleCurrentBuilderChange}
        options={options}
        defaultValue={options[0]}
      />
    )
  }

  renderLog = () => {
    const { logURL, status } = this.state.runDetail
    const isLoading = status === 'Running'
    if (!logURL && isLoading) {
      return (
        <div className={styles.title}>
          <Loading size="16" />
          <p>
            {t('Task')}
            <span className={styles.taskName}>
              {this.state.currentBuilderName}
            </span>
            {t('is Building')}
          </p>
        </div>
      )
    }

    if (logURL) {
      return (
        <Log
          onRerun={this.showRerun}
          runDetail={this.state.runDetail}
          builderName={this.state.currentBuilderName}
        />
      )
    }
    return null
  }

  render() {
    const { className } = this.props
    const config = get(this.state.builderDetail, 'spec.config')

    if (this.state.notFound) {
      return null
    }

    return (
      <Panel
        title={t('Building Image')}
        operations={this.renderBuilderSelect()}
      >
        <BuilderInfo config={config} className={className} />
        {this.renderLog()}
        <RerunModal
          detail={this.state.builderDetail}
          visible={this.state.showRerun}
          onOk={this.handleRerun}
          onCancel={this.hideRerun}
        />
      </Panel>
    )
  }
}
