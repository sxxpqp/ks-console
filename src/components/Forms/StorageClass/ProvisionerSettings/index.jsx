import React from 'react'
import { get, set, omit } from 'lodash'
import { Form } from '@kube-design/components'
import CardSelect from 'components/Inputs/CardSelect'
import { MODULE_KIND_MAP, PROVISIONERS } from 'utils/constants'

import styles from './index.scss'

export default class ProvisionerSettings extends React.Component {
  constructor(props) {
    super(props)

    if (!this.formTemplate.provisioner) {
      this.formTemplate.provisioner = PROVISIONERS[0].value
      set(
        this.formTemplate,
        "metadata.annotations['kubesphere.io/provisioner']",
        this.formTemplate.provisioner
      )
    }

    this.state = {
      provisioner: this.formTemplate.provisioner,
    }
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  provisionersOptions = [
    ...PROVISIONERS.map(item => omit(item, ['description'])),
    { label: t('Custom'), value: '', icon: 'hammer' },
  ]

  changeProvisioner = provisioner => {
    this.setState(
      {
        provisioner,
      },
      this.updateParams
    )
  }

  updateParams() {
    this.formTemplate.provisioner = this.state.provisioner
    this.formTemplate.parameters = {}
  }

  render() {
    const { formRef } = this.props
    const { provisioner } = this.state
    const { description } =
      PROVISIONERS.find(({ value }) => value === provisioner) || {}

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Form.Item
          label={
            <div className={styles.provisioner}>
              <h3>{t('CHOOSE_STORAGE_SYSTEM_TIP')}</h3>
              <p>{t('PROVISIONER_DEPENDENCE_DESC')}</p>
            </div>
          }
        >
          <CardSelect
            onChange={this.changeProvisioner}
            name="metadata.annotations['kubesphere.io/provisioner']"
            options={this.provisionersOptions}
          />
        </Form.Item>
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: t(description),
          }}
        />
      </Form>
    )
  }
}
