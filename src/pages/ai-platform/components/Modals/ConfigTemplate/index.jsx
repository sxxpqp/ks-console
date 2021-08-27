import React from 'react'
import PropTypes from 'prop-types'

import EditModal from 'components/Modals/Edit'

import FormsConfig from './config'

export default class EditConfigTemplateModal extends React.Component {
  static propTypes = {
    module: PropTypes.string,
  }

  static defaultProps = {
    module: 'deployments',
  }

  get forms() {
    return FormsConfig[this.props.module]
  }

  render() {
    const { module, ...rest } = this.props

    return (
      <EditModal
        title="Edit Config Template"
        icon="storage"
        module={module}
        forms={this.forms}
        {...rest}
      />
    )
  }
}
