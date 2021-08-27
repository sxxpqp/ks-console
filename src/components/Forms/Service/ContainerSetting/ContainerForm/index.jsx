import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Ports from 'components/Forms/Workload/ContainerSettings/ContainerForm/Ports'
import Commands from 'components/Forms/Workload/ContainerSettings/ContainerForm/Commands'
import Environments from 'components/Forms/Workload/ContainerSettings/ContainerForm/Environments'
import ImagePullPolicy from 'components/Forms/Workload/ContainerSettings/ContainerForm/ImagePullPolicy'
import HealthChecker from 'components/Forms/Workload/ContainerSettings/ContainerForm/HealthChecker'

import ContainerSetting from '../ContainerSetting'

import styles from './index.scss'

export default class ContaineForm extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    titlePrefix: PropTypes.string,
    namespace: PropTypes.string,
    module: PropTypes.string,
    data: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    configMaps: PropTypes.array,
    secrets: PropTypes.array,
  }

  static defaultProps = {
    className: '',
    namespace: '',
    module: '',
    data: {},
    onSave() {},
    onCancel() {},
    configMaps: [],
    secrets: [],
  }

  static contextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  get supportProbe() {
    return ['deployments', 'daemonsets', 'statefulsets'].includes(
      this.props.module
    )
  }

  render() {
    const {
      className,
      data,
      configMaps,
      secrets,
      cluster,
      namespace,
      withService,
    } = this.props

    const prefix = 'spec.template.spec.containers[0]'

    return (
      <div className={classNames(styles.wrapper, className)}>
        <ContainerSetting
          prefix={prefix}
          cluster={cluster}
          namespace={namespace}
          data={data}
        />
        <Ports prefix={prefix} withService={withService} />
        <ImagePullPolicy prefix={prefix} />
        {this.supportProbe && <HealthChecker prefix={prefix} />}
        <Commands prefix={prefix} />
        <Environments
          prefix={prefix}
          configMaps={configMaps}
          secrets={secrets}
        />
      </div>
    )
  }
}
