import React, { Component } from 'react'
import { get, isEmpty, set } from 'lodash'
import { Form } from '@kube-design/components'
import { Modal } from 'components/Base'
import { flattenObject } from 'utils'

import ParamInput from '../../ParamInput'

import styles from './index.scss'

export default class StorageParams extends Component {
  state = {
    visible: false,
    value: this.getFormData(),
  }

  getFormData() {
    const { value } = this.props
    return get(value, 'sources.chart.values', []).reduce((prev, cur) => {
      const [key, _value] = cur.split('=')
      return { ...prev, [key]: _value }
    }, {})
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.getFormData() })
    }
  }

  showEdit = () => {
    this.setState({ visible: true })
  }

  hideEdit = () => {
    this.setState({ visible: false })
  }

  handleEdit = data => {
    const { value, onChange } = this.props
    const flattenData = flattenObject(data)
    this.setState({ value: flattenData, visible: false })
    set(
      value,
      'sources.chart.values',
      Object.entries(flattenData).map(([key, _value]) => `${key}=${_value}`)
    )
    onChange({ ...value })
  }

  renderPreview() {
    const { params } = this.props
    const { value } = this.state

    if (isEmpty(params)) {
      return null
    }

    return (
      <div className={styles.preview}>
        {params.map(item => (
          <div key={item.name} className={styles.item}>
            <span>{item.title}: </span>
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
    const { value, visible } = this.state
    const { params } = this.props
    return (
      <Modal.Form
        title={t('Edit')}
        data={value}
        onOk={this.handleEdit}
        onCancel={this.hideEdit}
        visible={visible}
      >
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
