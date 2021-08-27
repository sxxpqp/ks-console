import React, { Component } from 'react'

import { Dropdown, Form, Icon } from '@kube-design/components'

import Confirm from 'components/Forms/Base/Confirm'

import styles from './index.scss'

export default class ContainerImages extends Component {
  formRef = React.createRef()

  get modifiers() {
    return { computeStyle: { gpuAcceleration: false } }
  }

  handleSubmit = () => {
    const { onOk } = this.props
    const form = this.formRef.current

    form &&
      form.validate(() => {
        onOk(form.getData())
      })
  }

  handleCancel = () => {
    this.props.hideEdit()
  }

  handleOpen = () => {
    this.props.showEdit()
  }

  renderContent() {
    const { formData, children } = this.props

    return (
      <div className={styles.form}>
        <Form ref={this.formRef} type="inner" data={formData}>
          <div className={styles.formContent}>{children}</div>
        </Form>
        <Confirm
          className={styles.confirm}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        />
      </div>
    )
  }

  render() {
    const { title, selected, isEdit } = this.props

    return (
      <Dropdown
        visible={isEdit}
        placement="bottom"
        closeAfterClick={false}
        onOpen={this.handleOpen}
        content={this.renderContent()}
        modifiers={this.modifiers}
        always={isEdit}
      >
        <div>
          {title}
          {selected && (
            <span className={styles.modify}>
              <span>{t('Edit')}</span>
              <Icon type="light" size={20} name="chevron-down" />
            </span>
          )}
        </div>
      </Dropdown>
    )
  }
}
