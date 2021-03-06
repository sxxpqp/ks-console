import { get, set, unset, isEmpty, omitBy, has } from 'lodash'
import React from 'react'
import { MODULE_KIND_MAP } from 'utils/constants'

import ConfigMapStore from 'stores/configmap'
import SecretStore from 'stores/secret'

import { Form } from '@kube-design/components'
import ReplicasControl from 'components/Forms/Workload/ContainerSettings/ReplicasControl'
import UpdateStrategy from 'components/Forms/Workload/ContainerSettings/UpdateStrategy'
// import { Switch } from 'components/Base'

import ToggleSimple from 'components/ToggleView/simple'
import ContainerForm from './ContainerForm'
// import styles from './index.scss'

export default class ContainerSetting extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showContainer: false,
      selectContainer: {},
      configMaps: [],
      secrets: [],
      replicas: this.getReplicas(),
      advanceMode: false,
    }

    this.configMapStore = new ConfigMapStore()
    this.secretStore = new SecretStore()

    this.handleContainer = this.handleContainer.bind(this)
  }

  componentDidMount() {
    const { formRef } = this.props

    this.fetchData()
    if (this.props.withService) {
      this.initService(this.formTemplate)
    }
    formRef.current.setCustomValidator(this.validator)
  }

  validator = cb => {
    this.handleContainer()
    cb && cb()
  }

  get prefix() {
    return this.props.prefix || 'spec.template.'
  }

  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  initService() {
    const workloadName = get(this.formTemplate, 'metadata.name')
    let serviceName = get(this.props.formTemplate, 'Service.metadata.name')

    if (workloadName && !serviceName) {
      serviceName = `${workloadName}-service`
      set(this.props.formTemplate, 'Service.metadata.name', serviceName)
      set(this.formTemplate, 'spec.serviceName', serviceName)
    }
  }

  getReplicas = () => get(this.formTemplate, `spec.replicas`) || 1

  fetchData() {
    const { cluster } = this.props
    const namespace = get(this.formTemplate, 'metadata.namespace')

    Promise.all([
      this.configMapStore.fetchListByK8s({ cluster, namespace }),
      this.secretStore.fetchListByK8s({ cluster, namespace }),
    ]).then(([configMaps, secrets]) => {
      this.setState({ configMaps, secrets })
    })
  }

  handleReplicaChange = value => {
    this.setState({ replicas: value })
  }

  updatePullSecrets = formData => {
    const pullSecrets = {}

    const imagePullSecretsPath = `${this.prefix}spec.imagePullSecrets`

    const containers = get(formData, `${this.prefix}spec.containers`, [])
    containers.forEach(container => {
      if (container.pullSecret) {
        pullSecrets[container.pullSecret] = ''
      }
    })

    set(
      formData,
      imagePullSecretsPath,
      !isEmpty(pullSecrets)
        ? Object.keys(pullSecrets).map(key => ({ name: key }))
        : null
    )
  }

  updateService = formData => {
    const { formTemplate, module } = this.props
    const containers = get(formData, `${this.prefix}spec.containers`, [])

    // auto gen service ports by workload container ports
    const servicePorts = []
    containers.forEach(container => {
      if (container.ports) {
        container.ports.forEach(port => {
          if (port.servicePort) {
            servicePorts.push({
              name: port.name,
              protocol: port.protocol,
              port: port.servicePort,
              targetPort: port.containerPort,
            })
          }
        })
      }
    })

    set(formTemplate, 'Service.spec.ports', servicePorts)

    const labels = get(formData, 'metadata.labels', {})
    const podLabels = get(formData, `${this.prefix}metadata.labels`, {})

    set(formTemplate, 'Service.metadata.labels', labels)
    set(formTemplate, 'Service.spec.selector', podLabels)

    if (module === 'StatefulSet') {
      set(formTemplate, 'Service.spec.clusterIP', 'None')
    } else {
      unset(formTemplate, 'Service.spec.clusterIP')
    }
  }

  handleContainer() {
    const container = get(this.formTemplate, `${this.prefix}spec.containers[0]`)

    if (has(container, 'resources.limits')) {
      container.resources.limits = omitBy(container.resources.limits, isEmpty)
    }

    // update image pull secrets
    this.updatePullSecrets(this.formTemplate)

    if (this.props.withService) {
      this.updateService(this.formTemplate)
    }
  }

  renderContainerForm() {
    const { withService, cluster, module } = this.props
    const { configMaps, secrets, advanceMode } = this.state

    return (
      <ContainerForm
        module={module}
        cluster={cluster}
        namespace={this.namespace}
        data={this.formTemplate}
        configMaps={configMaps}
        secrets={secrets}
        withService={withService}
        advanceMode={advanceMode}
      />
    )
  }

  renderReplicasControl() {
    return (
      <div className="margin-b12">
        <ReplicasControl
          template={this.formTemplate}
          onChange={this.handleReplicaChange}
        />
      </div>
    )
  }

  renderUpdateStrategy() {
    const { formRef, module } = this.props
    const { replicas } = this.state
    return (
      <div className="margin-t12">
        <UpdateStrategy
          formRef={formRef}
          module={module}
          data={this.formTemplate}
          replicas={replicas}
        />
      </div>
    )
  }

  handleModeChange = () => {
    const { advanceMode } = this.state
    this.setState({
      advanceMode: !advanceMode,
    })
  }

  render() {
    const { formRef } = this.props
    const { advanceMode } = this.state

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <div>
          <ToggleSimple
            title="????????????"
            onChange={this.handleModeChange}
          ></ToggleSimple>
        </div>
        {/* <div className={styles.switch}>
          <div>
            <strong>????????????</strong>
          </div>
          <Switch
            text="????????????"
            onChange={this.handleModeChange}
            checked={advanceMode}
          />
        </div> */}
        {this.renderContainerForm()}
        {advanceMode && this.renderUpdateStrategy()}
        {advanceMode && this.renderReplicasControl()}
      </Form>
    )
  }
}
