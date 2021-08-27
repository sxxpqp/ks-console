import React from 'react'
import { toJS } from 'mobx'
import { cloneDeep } from 'lodash'

export default class CustomArrayInput extends React.Component {
  static defaultProps = {
    defaultItemValue: {},
    value: [],
  }

  onAdd = () => {
    const { onChange, value = [], defaultItemValue } = this.props
    const newValue = [...value, defaultItemValue]
    onChange(newValue)
  }

  add = newValue => {
    const { onChange, value } = this.props
    onChange([...value, newValue])
  }

  onDelete(index) {
    return () => {
      const { value, onChange } = this.props
      const clone = cloneDeep(toJS(value))
      clone.splice(index, 1)
      onChange(clone)
    }
  }

  onUpClick(index) {
    return () => {
      const { value, onChange } = this.props
      const clone = cloneDeep(toJS(value))
      const tmp = clone[index]
      const switchIndex = (index - 1 + clone.length) % clone.length

      clone[index] = clone[switchIndex]
      clone[switchIndex] = tmp
      onChange(clone)
    }
  }

  onDownClick(index) {
    return () => {
      const { value, onChange } = this.props
      const clone = cloneDeep(toJS(value))
      const tmp = clone[index]
      const switchIndex = (index + 1 + clone.length) % clone.length

      clone[index] = clone[switchIndex]
      clone[switchIndex] = tmp
      onChange(clone)
    }
  }

  render() {
    const { value, header, children, name } = this.props

    return (
      <div>
        {header && header({ onAdd: this.onAdd, value, add: this.add })}
        <div>
          {value.map((item, index) =>
            children({
              index,
              value: item,
              formItemName: `${name}[${index}]`,
              onDelete: this.onDelete(index),
              onUpClick: this.onUpClick(index),
              onDownClick: this.onDownClick(index),
            })
          )}
        </div>
      </div>
    )
  }
}
