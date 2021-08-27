import React from 'react'
import PropTypes from 'prop-types'
import { get, set } from 'lodash'
import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'
import { updateLabels } from 'utils'
import FORM_TEMPLATES from 'utils/form.templates'
import { MODULE_KIND_MAP } from 'utils/constants'
import styles from './index.scss'

export default class StatefulSetting extends React.Component {
  static propTypes = {
    formTemplate: PropTypes.object,
  }

  get namespace() {
    const { formTemplate } = this.props
    return get(formTemplate, 'Service.metadata.namespace', '')
  }

  getValue = () => {
    const { formTemplate } = this.props
    return get(formTemplate, 'StatefulSet') ? 'stateful' : 'stateless'
  }

  handleChange = type => {
    this.setTemplate(type)
    this.forceUpdate()
  }

  setTemplate = type => {
    const { formTemplate } = this.props
    const currentType = formTemplate.Deployment ? 'stateless' : 'stateful'
    if (type === currentType) {
      return
    }

    const module = type === 'stateless' ? 'deployments' : 'statefulsets'
    const oldModule = type === 'stateless' ? 'statefulsets' : 'deployments'
    const kind = MODULE_KIND_MAP[module]
    const oldKind = MODULE_KIND_MAP[oldModule]
    this.props.store.setModule(module)
    this.props.updateModule(module)

    const metadata = get(formTemplate[oldKind], 'metadata')
    const labels = get(formTemplate[oldKind], 'metadata.labels')
    set(
      formTemplate,
      kind,
      FORM_TEMPLATES[module]({ namespace: this.namespace })
    )
    if (metadata) {
      set(formTemplate, `${kind}.metadata`, metadata)
    }
    updateLabels(formTemplate, module, labels)

    delete formTemplate[oldKind]
  }

  render() {
    const options = [
      {
        icon: 'backup',
        value: 'stateful',
        label: t('Stateful Service'),
        description: t('STATEFUL_SERVICE_DESC'),
      },
      {
        icon: 'backup',
        value: 'stateless',
        label: t('Stateless Service'),
        description: t('STATELESS_SERVICE_DESC'),
      },
    ]

    return (
      <Form.Item className={styles.formItem} label={t('Service Type')}>
        <TypeSelect
          value={this.getValue()}
          options={options}
          onChange={this.handleChange}
        />
      </Form.Item>
    )
  }
}
