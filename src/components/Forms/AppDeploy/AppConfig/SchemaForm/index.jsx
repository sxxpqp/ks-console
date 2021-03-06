import React from 'react'
import PropTypes from 'prop-types'
import { map, get, set, every, has, debounce, isEmpty } from 'lodash'
import { Form, Input, Slider, TextArea, Toggle } from '@kube-design/components'
import { Text } from 'components/Base'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class SchemaForm extends React.Component {
  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange() {},
  }

  state = {
    value: this.props.value,
  }

  triggerChange = debounce(value => {
    this.props.onChange(value)
  }, 300)

  handleFormChange(value) {
    this.setState({ value })
    this.triggerChange(value)
  }

  generateMarks = (min, max) => {
    const n = 5
    const step = parseInt((max - min) / n, 10)
    const o = {}
    for (let i = 0; i < n; i++) {
      const v = min + i * step
      o[v] = v
    }
    o[max] = max
    return o
  }

  renderFormItem = (propObj, propKey, propPath) => {
    const { value } = this.state
    const attrs = {
      defaultValue: get(value, propPath, ''),
      onChange: v => this.handleFormChange(set(value, propPath, v)),
    }

    let content

    switch (propObj.type) {
      case 'string':
        if (propObj.render === 'slider') {
          content = (
            <Slider
              max={propObj.sliderMax}
              min={propObj.sliderMin}
              unit={propObj.sliderUnit}
              marks={this.generateMarks(propObj.sliderMin, propObj.sliderMax)}
              {...attrs}
              withInput
            />
          )
        } else if (propObj.render === 'textArea') {
          content = <TextArea {...attrs} />
        } else {
          content = <Input {...attrs} />
        }
        break
      case 'integer':
        content = <NumberInput {...attrs} min={0} integer />
        break
      case 'boolean':
        content = (
          <div className={styles.boolean}>
            <Toggle {...attrs} defaultChecked={get(value, propPath, false)} />
            <Text title={propObj.title} description={propObj.description} />
          </div>
        )
        break
      case 'array':
        content = <>todo</>
        break
      default:
        content = <></>
    }

    return (
      <Form.Item
        key={propKey}
        label={propObj.type === 'boolean' ? '' : propObj.title}
        desc={propObj.type === 'boolean' ? '' : propObj.description}
      >
        {content}
      </Form.Item>
    )
  }

  renderSchemaForm = (propObj, propKey = '', propPath = []) => {
    const { type, form } = propObj
    const { value } = this.state

    const hidden =
      typeof propObj.hidden === 'object'
        ? get(value, propObj.hidden.value, null) === propObj.hidden.condition
        : get(value, propObj.hidden, false)

    if (hidden) {
      return null
    }

    if (type === 'object') {
      const subContent = map(propObj.properties, (v, k) =>
        this.renderSchemaForm(v, k, [...propPath, k])
      )

      if (isEmpty(subContent) || subContent.every(item => !item)) {
        return null
      }

      const isParentGroup =
        propObj.properties &&
        every(propObj.properties, item => has(item, 'properties'))

      return (
        <div
          key={propKey}
          className={isParentGroup ? styles.parentGroup : styles.group}
        >
          {propObj.title && <div className={styles.title}>{propObj.title}</div>}
          {propObj.description && (
            <p className={styles.description}>{propObj.description}</p>
          )}
          {subContent}
        </div>
      )
    }

    return form && this.renderFormItem(propObj, propKey, propPath)
  }

  render() {
    const { schema } = this.props
    return this.renderSchemaForm(schema)
  }
}
