import { get, set, omit } from 'lodash'
import React from 'react'

import { mergeLabels, updateFederatedAnnotations } from 'utils'
import ServiceStore from 'stores/service'

import CreateAppServiceModal from 'ai-platform/components/Modals/CreateAppService'
import ServiceList from './ServiceList'

import styles from './index.scss'

export default class Services extends React.Component {
  serviceStore = new ServiceStore()

  state = {
    components: omit(this.props.formData, ['application', 'ingress']) || {},
    editData: {},
    showAdd: false,
  }

  componentDidUpdate(prevProps) {
    const { formData } = this.props
    if (formData !== prevProps.formData) {
      this.setState({
        components: omit(formData, ['application', 'ingress']) || {},
      })
    }
  }

  get fedPrefix() {
    return this.props.isFederated ? 'spec.template.' : ''
  }

  validate(callback) {
    callback && callback()
  }

  showAdd = componentKey => {
    this.setState({
      showAdd: true,
      editData: this.getEditData(this.state.components[componentKey]),
    })
  }

  hideAdd = () => {
    this.setState({ showAdd: false, editData: {} })
  }

  getEditData = (component = {}) => {
    debugger
    const data = {}
    Object.values(component).forEach(item => {
      if (item.kind) {
        const kind = item.kind.replace('Federated', '')
        data[kind] = item
      }
    })
    return data
  }

  updateAppLabels(formData) {
    const appLabels = get(
      this.props.formData,
      `application.${this.fedPrefix}spec.selector.matchLabels`,
      []
    )
    mergeLabels(formData.workload, appLabels)
    mergeLabels(formData.service, appLabels)
  }

  updateGovernance(formData) {
    const { isGovernance, isFederated } = this.props
    set(
      formData.workload,
      'metadata.annotations["servicemesh.kubesphere.io/enabled"]',
      String(isGovernance)
    )
    set(
      formData.service,
      'metadata.annotations["servicemesh.kubesphere.io/enabled"]',
      String(isGovernance)
    )

    set(
      formData.workload,
      `spec.template.${this.fedPrefix}metadata.annotations["sidecar.istio.io/inject"]`,
      String(isGovernance)
    )

    if (isFederated) {
      updateFederatedAnnotations(formData.workload)
      updateFederatedAnnotations(formData.service)
    }
  }

  updateComponentKind = () => {
    const { application } = this.props.formData

    const componentKinds = [
      {
        group: '',
        kind: 'Service',
      },
      {
        group: 'apps',
        kind: 'Deployment',
      },
      {
        group: 'apps',
        kind: 'StatefulSet',
      },
      {
        group: 'extensions',
        kind: 'Ingress',
      },
      {
        group: 'servicemesh.kubesphere.io',
        kind: 'Strategy',
      },
      {
        group: 'servicemesh.kubesphere.io',
        kind: 'ServicePolicy',
      },
    ]

    set(application, `${this.fedPrefix}spec.componentKinds`, componentKinds)
  }

  handleAdd = data => {
    this.props.handleAdd && this.props.handleAdd(data)
    debugger
    // 这里只处理两种类型，没有处理s2i与b2i的情况
    data.workload = data.Deployment || data.StatefulSet
    data.service = data.Service

    this.updateAppLabels(data)
    this.updateGovernance(data)

    const key = get(data, 'service.metadata.name')
    const oldName = get(this.state.editData, 'Service.metadata.name')
    this.setState(
      ({ components }) => {
        if (oldName && components[oldName]) {
          delete components[oldName]
        }
        return { components: { ...components, [key]: data }, editData: {} }
      },
      () => {
        if (oldName) {
          delete this.props.formData[oldName]
        }
        this.props.formData[key] = data
        this.updateComponentKind()
        this.hideAdd()
      }
    )
  }

  handleDelete = key => {
    this.setState(
      ({ components }) => {
        delete components[key]
        return { components: { ...components } }
      },
      () => {
        delete this.props.formData[key]
        this.updateComponentKind()
      }
    )
  }

  render() {
    const { cluster, namespace, isFederated, projectDetail } = this.props
    const { components, showAdd, editData } = this.state

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Service Components1')}</div>
          <p>{t('APPLICATION_SERVICE_DESC1')}</p>
        </div>
        <div className={styles.title}>{t('Application Components1')}</div>
        <div className={styles.components}>
          <ServiceList
            data={components}
            clusters={projectDetail.clusters}
            onAdd={this.showAdd}
            onDelete={this.handleDelete}
          />
        </div>
        <CreateAppServiceModal
          cluster={cluster}
          namespace={namespace}
          detail={editData}
          store={this.serviceStore}
          module="services"
          visible={showAdd}
          onCancel={this.hideAdd}
          onOk={this.handleAdd}
          isFederated={isFederated}
          projectDetail={projectDetail}
        />
      </div>
    )
  }
}
