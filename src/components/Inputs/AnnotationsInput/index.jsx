import React from 'react'
import { AutoComplete } from '@kube-design/components'
import { PropertiesInput } from 'components/Inputs'
import { INGRESS_ANNOTATIONS } from 'utils/constants'

import styles from './index.scss'

export default class AnnotationsInput extends React.Component {
  itemProps = {
    keyProps: {
      component: AutoComplete,
      className: styles.dropdown,
      options: INGRESS_ANNOTATIONS,
    },
  }

  render() {
    return <PropertiesInput {...this.props} itemProps={this.itemProps} />
  }
}
