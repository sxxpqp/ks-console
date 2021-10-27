import { isEmpty, cloneDeep } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ReactComponent as BackIcon } from 'assets/back.svg'
import { Form } from '@kube-design/components'

import ToggleSimple from 'components/ToggleView/simple'
import Ports from './Ports'
import Commands from './Commands'
import Environments from './Environments'
import ImagePullPolicy from './ImagePullPolicy'
import HealthChecker from './HealthChecker'
import ContainerSetting from './ContainerSetting'
import SecurityContext from './SecurityContext'
import SyncTimeZone from './SyncTimeZone'

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
    type: 'Add',
    titlePrefix: '',
    namespace: '',
    module: '',
    data: {},
    onSave() {},
    onCancel() {},
    configMaps: [],
    secrets: [],
  }

  static childContextTypes = {
    forceUpdate: PropTypes.func,
  }

  getChildContext() {
    return {
      forceUpdate: () => {
        this.forceUpdate()
      },
    }
  }

  static contextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()

    this.state = {
      containerType: props.data.type || 'worker',
      formData: cloneDeep(props.data),
      advanceMode: false,
    }
  }

  componentDidMount() {
    this.registerForm()
  }

  get title() {
    const { type, titlePrefix } = this.props

    const title = t(`${type} Container`)

    return `${titlePrefix}${title}`
  }

  registerForm = () => {
    const { registerSubRoute } = this.context
    const { onCancel } = this.props

    registerSubRoute && registerSubRoute(this.handleSubmit, onCancel)
  }

  handleGoBack = () => {
    const { resetSubRoute } = this.context

    resetSubRoute && resetSubRoute()

    this.props.onCancel()
  }

  handleSubmit = callback => {
    const { onSave, withService } = this.props
    const form = this.formRef.current

    form &&
      form.validate(() => {
        const data = form.getData()

        if (data.args) {
          data.args = data.args.filter(item => !isEmpty(item))
        }

        if (data.command) {
          data.command = data.command.filter(item => !isEmpty(item))
        }

        if (data.env) {
          data.env = data.env.filter(({ name }) => !isEmpty(name))
        }

        if (data.ports) {
          data.ports = data.ports.filter(
            item => item.name && item.containerPort
          )
        }

        if (!withService && data.ports) {
          data.ports.forEach(item => {
            if (item.servicePort !== undefined) {
              delete item.servicePort
            }
          })
        }

        onSave(data)
        callback && callback()
      })
  }

  handleContainerTypeChange = containerType => {
    this.setState({ containerType })
  }

  handleToggleMode = () => {
    const { advanceMode } = this.state
    this.setState({
      advanceMode: !advanceMode,
    })
  }

  render() {
    const {
      className,
      configMaps,
      secrets,
      limitRange,
      imageRegistries,
      namespace,
      withService,
      rootStore,
    } = this.props
    const { containerType, formData, advanceMode } = this.state

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className="h5">
          <a className="custom-icon" onClick={this.handleGoBack}>
            <BackIcon />
          </a>
          {this.title}
          <div className={styles.right}>
            <ToggleSimple onChange={this.handleToggleMode}></ToggleSimple>
          </div>
        </div>
        <Form ref={this.formRef} data={formData}>
          <ContainerSetting
            data={formData}
            namespace={namespace}
            limitRange={limitRange}
            imageRegistries={imageRegistries}
            defaultContainerType={containerType}
            onContainerTypeChange={this.handleContainerTypeChange}
            rootStore={rootStore}
            advanceMode={advanceMode}
          />
          <Ports withService={containerType !== 'init' ? withService : false} />
          {advanceMode && <ImagePullPolicy />}
          {advanceMode && containerType !== 'init' && <HealthChecker />}
          <Commands />
          <Environments configMaps={configMaps} secrets={secrets} />
          {advanceMode && (
            <>
              <SecurityContext />
              <SyncTimeZone data={formData} />
            </>
          )}
        </Form>
      </div>
    )
  }
}
