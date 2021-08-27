import React, { Component } from 'react'
import { Form, Input } from '@kube-design/components'
import { Modal } from 'components/Base'

import ParamInput from '../../ParamInput'

import styles from './index.scss'

export default class NetworkParams extends Component {
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
          <span>{t('Pods CIDR')}: </span>
          <span>{value.kubePodsCIDR}</span>
        </div>
        <div className={styles.item}>
          <span>{t('Service CIDR')}: </span>
          <span>{value.kubeServiceCIDR}</span>
        </div>
        <a className={styles.edit} onClick={this.showEdit}>
          {t('Edit')}
        </a>
      </div>
    )
  }

  renderModal() {
    const { value, params } = this.props
    return (
      <Modal.Form
        title={t('Edit')}
        data={value}
        onOk={this.handleEdit}
        onCancel={this.hideEdit}
        visible={this.state.visible}
      >
        <Form.Item label={t('Pods CIDR')} desc={t('KUBE_PODS_CIDR_DESC')}>
          <Input name="kubePodsCIDR" />
        </Form.Item>
        <Form.Item label={t('Service CIDR')} desc={t('KUBE_SERVICE_CIDR_DESC')}>
          <Input name="kubeServiceCIDR" />
        </Form.Item>
        {params.map(param => (
          <Form.Item
            key={param.name}
            label={t(param.title)}
            desc={t(param.description)}
          >
            <ParamInput
              name={param.name}
              defaultValue={param.default}
              param={param}
            />
          </Form.Item>
        ))}
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
