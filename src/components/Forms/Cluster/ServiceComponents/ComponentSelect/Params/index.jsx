import React, { Component } from 'react'
import { Form } from '@kube-design/components'
import { Modal } from 'components/Base'

import ParamInput from '../../../ParamInput'

import styles from './index.scss'

export default class Params extends Component {
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
    const { data, value } = this.props

    return (
      <div className={styles.preview}>
        {data.map(item => (
          <div key={item.name} className={styles.item}>
            <span>{t(item.title) || item.name}: </span>
            <span>{value[item.name]}</span>
          </div>
        ))}
        <a className={styles.edit} onClick={this.showEdit}>
          {t('Edit')}
        </a>
      </div>
    )
  }

  renderModal() {
    const { data, value } = this.props

    return (
      <Modal.Form
        title={t('Edit')}
        data={value}
        onOk={this.handleEdit}
        onCancel={this.hideEdit}
        visible={this.state.visible}
      >
        {data.map(param => (
          <Form.Item
            key={param.name}
            label={t(param.title || param.name)}
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
