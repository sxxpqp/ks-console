import React from 'react'
import { get, set } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'
import { Form } from '@kube-design/components'

import DataList from './DataList'
import DataForm from './DataForm'

export default class ConfigMapSettings extends React.Component {
  state = {
    state: '',
    selectDataKey: '',
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  handleData = data => {
    const { selectDataKey } = this.state
    const originData = get(this.fedFormTemplate, 'data', {})

    if (selectDataKey) {
      delete originData[selectDataKey]
    }

    set(this.fedFormTemplate, 'data', { ...originData, ...data })

    this.hideDataForm()
  }

  showDataForm = () => {
    this.setState({ state: 'data', selectDataKey: '' })
  }

  hideDataForm = () => {
    this.setState({ state: '', selectDataKey: '' })
  }

  handleDataItemEdit = key => {
    this.setState({ state: 'data', selectDataKey: key })
  }

  renderDataForm() {
    const { selectDataKey } = this.state
    const originData = get(this.fedFormTemplate, 'data', {})

    return (
      <DataForm
        detail={originData}
        selectKey={selectDataKey}
        onOk={this.handleData}
        onCancel={this.hideDataForm}
      />
    )
  }

  render() {
    const { formRef } = this.props
    const { state } = this.state

    if (state === 'data') {
      return this.renderDataForm()
    }

    return (
      <Form data={this.fedFormTemplate} ref={formRef}>
        <Form.Item label={t('Config Value')}>
          <DataList
            name="data"
            onEdit={this.handleDataItemEdit}
            onAdd={this.showDataForm}
          />
        </Form.Item>
      </Form>
    )
  }
}
