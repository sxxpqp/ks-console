import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { computed, toJS } from 'mobx'
import { get } from 'lodash'
import EditMonitorFormLayou from '../components/EditMonitorFormLayout'
import { GraphTextInput } from '../components/FormInput'
import { SingleStatGraph } from '../components/Graph'
import FormGroupCard from '../components/FormGroupCard'
import SingleStatDataForm from '../components/Form/SingleStatData'
import ErrorContainer from '../components/ErrorContainer'

@inject('monitoringStore', 'labelStore')
@observer
export default class TextMonitorForm extends Component {
  @computed
  get monitor() {
    return this.props.monitor
  }

  @computed
  get supportMetrics() {
    return this.props.monitoringStore.targetsMetadata.map(metadata => ({
      value: metadata.metric,
      desc: metadata.help,
      type: metadata.type,
    }))
  }

  @computed
  get stat() {
    return this.monitor.stat
  }

  componentDidMount() {
    this.props.monitoringStore.fetchMetadata()
  }

  handleLabelSearch = metric => {
    const { cluster, namespace } = this.props.monitoringStore
    const { from, to } = this.props.monitoringStore.getTimeRange()

    this.props.labelStore.fetchLabelSets({
      cluster,
      namespace,
      metric,
      start: Math.floor(from.valueOf() / 1000),
      end: Math.floor(to.valueOf() / 1000),
    })
  }

  render() {
    const singleState = this.stat
    const title = get(this.monitor, 'config.title', '')
    const labelsets = toJS(this.props.labelStore.labelsets)

    return (
      <EditMonitorFormLayou
        preview={
          <ErrorContainer errorMessage={this.monitor.errorMessage}>
            <SingleStatGraph singleState={singleState} title={title} />
          </ErrorContainer>
        }
        sidebar={<GraphTextInput type="singlestat" />}
        main={
          <FormGroupCard label={t('Data')}>
            <SingleStatDataForm
              supportMetrics={this.supportMetrics}
              labelsets={labelsets}
              onLabelSearch={this.handleLabelSearch}
            />
          </FormGroupCard>
        }
      />
    )
  }
}
