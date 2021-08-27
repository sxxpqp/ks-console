import React from 'react'
import { get } from 'lodash'
import CustomMonitoringModal from 'components/Modals/CustomMonitoring'
import CustomMonitoringTemplate from 'stores/monitoring/custom/template'
import CreateModal from 'components/Modals/Create'
import FORM_STEPS from 'configs/steps/dashborads'

export default class CreateDashboardModalContainer extends React.Component {
  state = {
    finishBasis: false,
  }

  handleOk = async () => {
    this.props.onOk(this.store.toJS())
  }

  handleBasicConfirm = params => {
    const { cluster, namespace } = this.props
    this.store = new CustomMonitoringTemplate({
      cluster,
      namespace,
      formTemplate: params,
      name: get(params, 'metadata.name'),
      description: get(
        params,
        'metadata.annotations["kubesphere.io/description"]'
      ),
      isEditing: true,
      ...params.spec,
    })

    this.setState({ finishBasis: true })
  }

  render() {
    const { finishBasis } = this.state
    const {
      cluster,
      namespace,
      formTemplate,
      isSubmitting,
      onCancel,
      store,
    } = this.props
    const { module } = store

    if (finishBasis) {
      return (
        <CustomMonitoringModal
          store={this.store}
          cluster={cluster}
          onOk={this.handleOk}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      )
    }

    return (
      <CreateModal
        visible
        module={module}
        name="CUSTOM_MONITORING_DASHBOARD"
        cluster={cluster}
        namespace={namespace}
        formTemplate={formTemplate}
        steps={FORM_STEPS}
        store={store}
        onOk={this.handleBasicConfirm}
        onCancel={onCancel}
        okBtnText={t('Next')}
      />
    )
  }
}
