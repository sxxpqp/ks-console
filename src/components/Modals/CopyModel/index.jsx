import React from 'react'
import PropTypes from 'prop-types'

import { get, isFunction, cloneDeep } from 'lodash'
import { Icon, Notify } from '@kube-design/components'
import { Modal, Switch } from 'components/Base'
import Code from './Code'

import styles from './index.scss'

export default class CopyModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    title: PropTypes.string,
    name: PropTypes.string,
    module: PropTypes.string,
    steps: PropTypes.array,
    store: PropTypes.object,
    formTemplate: PropTypes.object,
    okBtnText: PropTypes.string, // not requried
    noCodeEdit: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    noCodeEdit: false,
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      formTemplate: cloneDeep(props.formTemplate),
      isCodeMode: props.onlyCode || false,
      currentStep: 0,
      hideFooter: false,
      width: 520,
    }

    this.codeRef = React.createRef()
    this.formRef = React.createRef()
  }

  renderCodeEditor() {
    const { onCancel, isSubmitting } = this.props
    const { formTemplate } = this.state
    return (
      <Code
        ref={this.codeRef}
        formTemplate={formTemplate}
        onOk={this.handleCode}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    )
  }

  handleCode = data => {
    const { onOk } = this.props
    onOk(data)
  }

  handleModeChange = () => {
    this.setState(({ isCodeMode, formTemplate, hideFooter }) => {
      const newState = {
        formTemplate,
        isCodeMode: !isCodeMode,
        hideFooter: !hideFooter,
        width: !hideFooter ? 960 : 520,
      }

      if (
        !isCodeMode &&
        isFunction(get(this, 'formRef.current.hasSubRoute')) &&
        this.formRef.current.hasSubRoute()
      ) {
        return Notify.warning(t('Please save the current form first'))
      }

      return newState
    })
  }

  renderOperations() {
    const { noCodeEdit, onlyCode } = this.props
    const { isCodeMode } = this.state

    if (noCodeEdit || onlyCode) {
      return null
    }
    return (
      <Switch
        className={styles.switch}
        text="专业模式"
        checked={true}
        checked={isCodeMode}
        onChange={this.handleModeChange}
      />
    )
  }

  renderContent() {
    const { desc, title } = this.props
    return (
      <div className={styles.wrapper}>
        <Icon name="question" size={40} />
        <div className={styles.text}>
          <div>{title} ?</div>
          <p>{desc} </p>
        </div>
      </div>
    )
  }

  render() {
    const { noCodeEdit, ...rest } = this.props
    const { isCodeMode, hideFooter, width } = this.state

    return (
      <Modal
        title="快速复制"
        width={width || 520}
        {...rest}
        operations={this.renderOperations()}
        hideFooter={hideFooter}
        bodyClassName={hideFooter ? styles.body : styles.default}
      >
        {!noCodeEdit && isCodeMode
          ? this.renderCodeEditor()
          : this.renderContent()}
      </Modal>
    )
  }
}
