import { cloneDeep } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@kube-design/components'
import { Modal } from 'components/Base'
import FORM_TEMPLATES from 'utils/form.templates'

import RouterStore from 'stores/router'

import Steps from './Steps'
import BaseInfo from './BaseInfo'
import ClusterSettings from './ClusterSettings'

import styles from './index.scss'

export default class WorkspaceCreateModal extends React.Component {
  static propTypes = {
    namespace: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    sampleApp: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      formTemplate: cloneDeep(FORM_TEMPLATES['workspaces']()),
    }

    this.formRef = React.createRef()

    this.routerStore = new RouterStore()
  }

  get steps() {
    if (!globals.app.isMultiCluster) {
      return [
        {
          title: 'Basic Info',
          component: BaseInfo,
          required: true,
          isForm: true,
        },
      ]
    }

    return [
      {
        title: 'Basic Info',
        component: BaseInfo,
        required: true,
        isForm: true,
      },
      {
        title: 'Cluster Settings',
        component: ClusterSettings,
        required: true,
      },
    ]
  }

  handleOk = () => {
    this.props.onOk(this.state.formTemplate)
  }

  handlePrev = () => {
    this.setState(({ currentStep }) => ({
      currentStep: Math.max(0, currentStep - 1),
    }))
  }

  handleNext = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        this.setState(({ currentStep }) => ({
          currentStep: Math.min(this.steps.length - 1, currentStep + 1),
        }))
      })
  }

  renderForm() {
    const { store } = this.props
    const { formTemplate, currentStep } = this.state

    const step = this.steps[currentStep]
    const Component = step.component

    const props = {
      store,
      formTemplate,
    }

    if (step.isForm) {
      props.formRef = this.formRef
    } else {
      props.ref = this.formRef
    }

    return (
      <div className={styles.formWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.form}>
            <Component {...props} />
          </div>
        </div>
      </div>
    )
  }

  renderHeader() {
    const { onCancel } = this.props
    const { currentStep } = this.state
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          <Icon name="close" size={20} clickable onClick={onCancel} />
          <span />
          <Icon name="enterprise" size={20} />
          <span>{t('Create Workspace')}</span>
        </div>
        <div className={styles.wrapper}>
          {this.steps.length > 1 && (
            <Steps steps={this.steps} current={currentStep} />
          )}
        </div>
        <div className={styles.headerBottom} />
      </div>
    )
  }

  renderFooter() {
    const { onCancel, isSubmitting } = this.props
    const { currentStep } = this.state

    const total = this.steps.length - 1
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <div className="text-right">
            <Button onClick={onCancel}>{t('Cancel')}</Button>
            {currentStep > 0 && (
              <Button type="control" onClick={this.handlePrev}>
                {t('Previous')}
              </Button>
            )}
            {currentStep < total ? (
              <Button type="control" onClick={this.handleNext}>
                {t('Next')}
              </Button>
            ) : (
              <Button
                type="control"
                onClick={this.handleOk}
                loading={isSubmitting}
              >
                {t('Create')}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { visible } = this.props

    return (
      <Modal
        className={styles.modal}
        bodyClassName={styles.body}
        visible={visible}
        hideHeader
        hideFooter
        fullScreen
      >
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </Modal>
    )
  }
}
