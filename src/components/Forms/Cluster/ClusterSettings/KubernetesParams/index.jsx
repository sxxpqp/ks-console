import React, { Component } from 'react'
import { Form } from '@kube-design/components'
import { Modal } from 'components/Base'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class KubernetesParams extends Component {
  state = {
    visible: false,
  }

  showEdit = () => {
    this.setState({ visible: true })
  }

  hideEdit = () => {
    this.setState({ visible: false })
  }

  handleEdit = data => {
    const { value, onChange } = this.props
    onChange({ ...value, ...data })
    this.hideEdit()
  }

  renderPreview() {
    const { value } = this.props
    return (
      <div className={styles.preview}>
        <div className={styles.item}>
          <span>{t('Max Pods')}: </span>
          <span>{value.maxPods}</span>
        </div>
        <a className={styles.edit} onClick={this.showEdit}>
          {t('Edit')}
        </a>
      </div>
    )
  }

  renderModal() {
    const { value } = this.props
    return (
      <Modal.Form
        title={t('Edit')}
        data={value}
        onOk={this.handleEdit}
        onCancel={this.hideEdit}
        visible={this.state.visible}
      >
        <Form.Item label={t('Max Pods')} desc={t('CLUSTER_MAX_PODS_DESC')}>
          <NumberInput name="maxPods" integer min={0} />
        </Form.Item>
      </Modal.Form>
    )
  }

  render() {
    return (
      <div>
        {this.renderPreview()}
        {this.renderModal()}
      </div>
    )
  }
}
