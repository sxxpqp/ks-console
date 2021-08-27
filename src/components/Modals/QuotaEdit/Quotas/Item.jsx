import React from 'react'

import { Button, Select } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import { QUOTAS_MAP } from 'utils/constants'

import {
  RESERVED_MODULES,
  FEDERATED_PROJECT_UNSOPPORT_QUOTA,
} from './constants'

import styles from './index.scss'

export default class QuotaItem extends React.Component {
  get options() {
    const { filterModules = [], module } = this.props
    const filteredModules = [
      ...filterModules.filter(m => m !== module),
      ...RESERVED_MODULES,
    ]
    return Object.keys(QUOTAS_MAP)
      .filter(
        key =>
          !filteredModules.includes(key) &&
          (this.props.isFederated
            ? !FEDERATED_PROJECT_UNSOPPORT_QUOTA.includes(key)
            : true)
      )
      .map(key => ({
        label: key === 'volumes' ? t('Number of volumes') : t(key),
        value: key,
      }))
  }

  handleModuleChange = newModule => {
    const { module, onModuleChange } = this.props
    onModuleChange(newModule, module)
  }

  handleModuleDelete = () => {
    const { module, onModuleDelete } = this.props
    onModuleDelete(module)
  }

  render() {
    const { value, module, onChange, disableSelect } = this.props

    return (
      <div className={styles.item}>
        <Select
          value={module}
          disabled={disableSelect}
          options={this.options}
          onChange={this.handleModuleChange}
        />
        <NumberInput
          className="margin-l12"
          value={value}
          placeholder={t(
            'You can limit the number of resources. Blank means no limit.'
          )}
          integer
          onChange={onChange}
        />
        <Button
          type="flat"
          icon="trash"
          className="margin-l12"
          onClick={this.handleModuleDelete}
          disabled={disableSelect}
        />
      </div>
    )
  }
}
