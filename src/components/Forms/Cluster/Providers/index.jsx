import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, set } from 'lodash'
import { Icon, RadioGroup, Radio, Form } from '@kube-design/components'
import { NEW_CLUSTER, IMPORT_CLUSTER } from 'configs/steps/clusters'
import Title from '../Title'
import { IMPORT_CLUSTER_SPEC, NEW_CLUSTER_SPEC } from '../constants'

import styles from './index.scss'

export default class Providers extends React.Component {
  static contextTypes = {
    setSteps: PropTypes.func,
    setFormData: PropTypes.func,
  }

  STEPS = {
    new: NEW_CLUSTER,
    import: IMPORT_CLUSTER,
  }

  SPECS = {
    new: NEW_CLUSTER_SPEC,
    import: IMPORT_CLUSTER_SPEC,
  }

  componentDidMount() {
    this.props.store.kubekey.fetchParameters()
  }

  handleChange = value => {
    this.context.setSteps(this.STEPS[value])
    const newFormData = cloneDeep(this.SPECS[value])
    set(newFormData, "metadata.annotations['kubesphere.io/way-to-add']", value)
    this.context.setFormData(newFormData)
  }

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <Title
          title={t('SELECT_ADD_CLUSTER_METHOD')}
          description={t('SELECT_ADD_CLUSTER_METHOD_DESC')}
        />
        <Form data={formTemplate} ref={formRef}>
          <Form.Item className={styles.cards}>
            <RadioGroup
              name="metadata.annotations['kubesphere.io/way-to-add']"
              onChange={this.handleChange}
              defaultValue="new"
            >
              <Radio value="new">
                <Icon name="kubernetes" size={48} />
                <span>{t('New Cluster')}</span>
              </Radio>
              <Radio value="import">
                <Icon name="hammer" size={48} />
                <span>{t('Import Cluster')}</span>
              </Radio>
            </RadioGroup>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
