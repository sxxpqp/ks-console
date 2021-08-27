import React from 'react'
import { get, keyBy } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form } from '@kube-design/components'

import ClustersMapper from './ClustersMapper'
import ContainersMapper from './ContainersMapper'
import ContainerImage from './ContainerImage'
import ContainerPorts from './ContainerPorts'
import Environments from './Environments'
import VolumesMapper from './VolumesMapper'
import VolumeTemplate from './VolumeTemplate'

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

  get showVolumeTemplate() {
    return (
      this.props.module === 'statefulsets' &&
      get(this.formTemplate, 'spec.template.spec.volumeClaimTemplates')
    )
  }

  render() {
    const { formRef, projectDetail, withService } = this.props
    const clustersDetail = keyBy(projectDetail.clusters, 'name')
    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Group
          label={t('Container Image')}
          desc={t('CLUSTER_CONTAINER_IMAGE_DIFF_DESC')}
          checkable
        >
          <ClustersMapper
            clusters={this.clusters}
            clustersDetail={clustersDetail}
            namespace={this.namespace}
          >
            {props => (
              <ContainersMapper formTemplate={this.formTemplate} {...props}>
                {containerProps => <ContainerImage {...containerProps} />}
              </ContainersMapper>
            )}
          </ClustersMapper>
        </Form.Group>
        {this.showVolumeTemplate && (
          <Form.Group
            label={t('Volume Template Settings')}
            desc={t('CLUSTER_VOLUME_DIFF_DESC')}
            checkable
          >
            <ClustersMapper
              clusters={this.clusters}
              clustersDetail={clustersDetail}
              namespace={this.namespace}
            >
              {props => (
                <VolumesMapper formTemplate={this.formTemplate} {...props}>
                  {volumeProps => <VolumeTemplate {...volumeProps} />}
                </VolumesMapper>
              )}
            </ClustersMapper>
          </Form.Group>
        )}
        <Form.Group
          label={t('Service Settings')}
          desc={t('CLUSTER_SERVICE_DIFF_DESC')}
          checkable
        >
          <ClustersMapper
            clusters={this.clusters}
            clustersDetail={clustersDetail}
            namespace={this.namespace}
          >
            {props => (
              <ContainersMapper
                formTemplate={this.formTemplate}
                withService={withService}
                serviceTemplate={get(this.props.formTemplate, 'Service')}
                {...props}
              >
                {containerProps => <ContainerPorts {...containerProps} />}
              </ContainersMapper>
            )}
          </ClustersMapper>
        </Form.Group>
        <Form.Group
          label={t('Environment Variables')}
          desc={t('CLUSTER_ENV_DIFF_DESC')}
          checkable
        >
          <ClustersMapper
            clusters={this.clusters}
            clustersDetail={clustersDetail}
            namespace={this.namespace}
          >
            {props => (
              <ContainersMapper formTemplate={this.formTemplate} {...props}>
                {containerProps => <Environments {...containerProps} />}
              </ContainersMapper>
            )}
          </ClustersMapper>
        </Form.Group>
      </Form>
    )
  }
}
