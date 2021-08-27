import React from 'react'
import PropTypes from 'prop-types'
import { get, cloneDeep, isEmpty } from 'lodash'
import { Modal } from 'components/Base'

import RouteRulesForm from 'components/Forms/Route/RouteRules'

import styles from './index.scss'

class RouteRulesEdit extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    detail: {},
    visible: false,
    onOk: () => {},
    onCancel: () => {},
    isSubmitting: false,
  }

  static childContextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  getChildContext() {
    return {
      registerSubRoute: this.registerSubRoute,
      resetSubRoute: this.resetSubRoute,
    }
  }

  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.state = {
      subRoute: {},
      formTemplate: this.getFormTemplate(props.detail),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.detail !== prevProps.detail) {
      this.setState({
        formTemplate: this.getFormTemplateI(this.props.detail),
      })
    }
  }

  getFormTemplate(detail) {
    const formTemplate = cloneDeep(detail)
    const tls = get(formTemplate, 'spec.tls', [])
    const rules = get(formTemplate, 'spec.rules', [])
    if (tls.length > 0 && rules.length > 0) {
      rules.forEach(rule => {
        const tlsItem = tls.find(
          item => item.hosts && item.hosts.includes(rule.host)
        )
        if (tlsItem) {
          rule.protocol = 'https'
          rule.secretName = tlsItem.secretName
        } else {
          rule.protocol = 'http'
        }
      })
    }
    return { Ingress: formTemplate }
  }

  registerSubRoute = (onSave, onCancel) => {
    this.setState({ subRoute: { onSave, onCancel } })
  }

  resetSubRoute = () => {
    this.setState({ subRoute: {} })
  }

  handleOk = () => {
    const { subRoute } = this.state
    if (subRoute.onSave) {
      return subRoute.onSave(() => {
        this.setState({ subRoute: {} })
      })
    }

    const { onOk } = this.props
    const formData = this.state.formTemplate

    const data = formData.Ingress

    onOk(data)
  }

  handleCancel = () => {
    const { subRoute } = this.state
    if (subRoute.onCancel) {
      subRoute.onCancel()
      this.setState({ subRoute: {} })
      return
    }

    const { onCancel } = this.props

    onCancel()
  }

  render() {
    const { visible, cluster, isSubmitting } = this.props
    const { subRoute, formTemplate } = this.state

    return (
      <Modal
        width={960}
        title={t('Edit Rules')}
        icon="firewall"
        onOk={this.handleOk}
        okText={!isEmpty(subRoute) ? t('Save') : t('Update')}
        cancelText={!isEmpty(subRoute) ? t('Previous') : null}
        onCancel={this.handleCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <div className={styles.wrapper}>
          <RouteRulesForm
            module="ingresses"
            formRef={this.form}
            formTemplate={formTemplate}
            cluster={cluster}
          />
        </div>
      </Modal>
    )
  }
}

export default RouteRulesEdit
