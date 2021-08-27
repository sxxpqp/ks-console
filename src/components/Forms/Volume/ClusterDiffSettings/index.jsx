import React from 'react'
import { get, keyBy } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form } from '@kube-design/components'

import ClustersMapper from 'components/Forms/Workload/ClusterDiffSettings/ClustersMapper'
import VolumeSettings from './VolumeSettings'

export default class AdvancedSettings extends React.Component {
  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get clusters() {
    return get(this.formTemplate, 'spec.placement.clusters', [])
  }

  render() {
    const { formRef, projectDetail } = this.props
    const clustersDetail = keyBy(projectDetail.clusters, 'name')
    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Group
          label={t('Volume Settings')}
          desc={t('CLUSTER_VOLUME_DIFF_DESC')}
          checkable
        >
          <ClustersMapper
            clusters={this.clusters}
            clustersDetail={clustersDetail}
            namespace={this.namespace}
          >
            {props => (
              <VolumeSettings {...props} formTemplate={this.formTemplate} />
            )}
          </ClustersMapper>
        </Form.Group>
      </Form>
    )
  }
}
