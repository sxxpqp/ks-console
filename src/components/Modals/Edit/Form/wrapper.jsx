import React from 'react'
import { toJS } from 'mobx'
import classnames from 'classnames'
import { get, cloneDeep } from 'lodash'

import Confirm from 'components/Forms/Base/Confirm'

import styles from './index.scss'

const EnhanceWrapper = function(Component) {
  return class WrapperComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        showFormActions: false,
        formData: cloneDeep(toJS(props.formData)),
      }

      this.initialState = cloneDeep(this.state)
    }

    get name() {
      return this.props.name
    }

    get formTemplate() {
      const target = this.props.templatePrefix
        ? `formData.${this.props.templatePrefix}`
        : 'formData'
      return get(this.state, target, {})
    }

    get formProps() {
      return {
        onChange: this.handleFormChange,
      }
    }

    handleFormChange = () => {
      this.setState({
        showFormActions: true,
      })
    }

    handleSaveChange = () => {
      const { formRef, onSaveChange } = this.props
      const form = get(formRef, 'current')

      form &&
        form.validate(() => {
          this.setState({ showFormActions: false }, () => {
            onSaveChange && onSaveChange(this.name, this.state.formData)
            this.prevState = {
              ...this.state,
              formData: cloneDeep(this.state.formData),
            }
          })
        })
    }

    handleCancelChange = () => {
      const prevState = this.prevState || this.initialState

      this.setState({
        ...prevState,
      })
    }

    renderFormActions() {
      return (
        <Confirm
          className={classnames(styles.formActions, {
            [styles.active]: this.state.showFormActions,
          })}
          okText={t('Save')}
          cancelText={t('Undo')}
          onOk={this.handleSaveChange}
          onCancel={this.handleCancelChange}
        />
      )
    }

    render() {
      const { module, formRef, ...rest } = this.props
      return (
        <div className={styles.formWrapper}>
          <Component
            {...rest}
            formTemplate={this.formTemplate}
            formProps={this.formProps}
            formRef={formRef}
            module={module}
          />
          {this.renderFormActions()}
        </div>
      )
    }
  }
}

export default EnhanceWrapper
