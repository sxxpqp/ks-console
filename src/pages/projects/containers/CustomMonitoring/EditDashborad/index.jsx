import React from 'react'
import CustomMonitoringModal from 'components/Modals/CustomMonitoring'
import CustomMonitoringTemplate from 'stores/monitoring/custom/template'

export default class EditDashboardModalContainer extends React.Component {
  constructor(props) {
    super(props)

    /**
     * store custom monitor data make it ease to change and test
     */
    const { metadata = {}, spec = {} } = props.data
    const {
      title,
      description,
      refresh,
      panels,
      datasource,
      templatings,
      time,
    } = spec

    const { namespace, name } = metadata

    this.store = new CustomMonitoringTemplate({
      title,
      cluster: props.cluster,
      namespace,
      description,
      refresh,
      isEditing: false,
      panels,
      datasource,
      templatings,
      time,
      name,
      formTemplate: props.data,
    })
  }

  handleOk = async () => {
    const params = this.store.toJS()
    await this.props.onOk(params)
    this.store.switchEditingMode(false)
  }

  render() {
    const { cluster, readOnly, isSubmitting, onCancel } = this.props
    return (
      <CustomMonitoringModal
        store={this.store}
        cluster={cluster}
        readOnly={readOnly}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onOk={this.handleOk}
      />
    )
  }
}
