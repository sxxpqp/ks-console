import React from 'react'
import PropTypes from 'prop-types'

import EditModal from 'components/Modals/Edit'

import FormsConfig from './config'

export default class EditGrayReleaseModal extends React.Component {
  static propTypes = {
    module: PropTypes.string,
  }

  static defaultProps = {
    module: 'grayreleases',
  }

  get forms() {
    return FormsConfig
  }

  render() {
    const { module, ...rest } = this.props

    return (
      <EditModal
        title="Edit Component"
        icon="components"
        module={module}
        forms={this.forms}
        {...rest}
      />
    )
  }
}
