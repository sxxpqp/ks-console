import { isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '@kube-design/components'

import Item from './Item'
import ArrayInput from '../ArrayInput'

export default class EnvironmentInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    configMaps: PropTypes.array,
    secrets: PropTypes.array,
  }

  static defaultProps = {
    name: '',
    onChange() {},
    configMaps: [],
    secrets: [],
  }

  handleAddRef = () => {
    const { value, onChange } = this.props
    if (isEmpty(value)) {
      return onChange([{ name: '', valueFrom: {} }])
    }

    if (value.length === 1 && value[0].name === '' && value[0].value === '') {
      return onChange([{ name: '', valueFrom: {} }])
    }

    if (value.every(this.checkItemValid)) {
      return onChange([...value, { name: '', valueFrom: {} }])
    }
  }

  checkItemValid = item =>
    !isEmpty(item) &&
    !isEmpty(item.name) &&
    (!isEmpty(item.value) || !isEmpty(item.valueFrom))

  render() {
    const { configMaps, secrets, ...rest } = this.props

    return (
      <ArrayInput
        itemType="object"
        checkItemValid={this.checkItemValid}
        addText={t('Add Environment Variable')}
        extraAdd={
          <Button onClick={this.handleAddRef} data-test="add-env-configmap">
            {t('Use ConfigMap or Secret')}
          </Button>
        }
        {...rest}
      >
        <Item configMaps={configMaps} secrets={secrets} />
      </ArrayInput>
    )
  }
}
