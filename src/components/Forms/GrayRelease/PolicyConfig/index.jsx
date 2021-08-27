import React from 'react'
import { observer } from 'mobx-react'
import { get } from 'lodash'

import Canary from './Canary'
import Bluegreen from './Bluegreen'
import Mirror from './Mirror'

const COMPONENTS = {
  Canary,
  Bluegreen,
  Mirror,
}

@observer
export default class PolicyConfig extends React.Component {
  get strategyType() {
    return get(this.formTemplate, 'strategy.spec.type', '')
  }

  get formTemplate() {
    return this.props.formTemplate
  }

  render() {
    const { formRef, formProps } = this.props

    const Component = COMPONENTS[this.strategyType]

    if (!Component) {
      return null
    }

    return (
      <Component
        formRef={formRef}
        formTemplate={this.formTemplate}
        {...formProps}
      />
    )
  }
}
