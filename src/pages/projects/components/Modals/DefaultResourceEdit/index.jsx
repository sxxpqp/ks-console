import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Modal } from 'components/Base'
import { ResourceLimit } from 'components/Inputs'

export default class DefaultResourceEditModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    namespace: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    namespace: '',
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      data: get(props.detail, 'limit', {}),
      error: '',
    }
  }

  componentDidUpdate(prevProps) {
    const { detail } = this.props
    if (detail.limit && detail.limit !== prevProps.detail.limit) {
      this.setState({ data: detail.limit })
    }
  }

  get resourceLimit() {
    return {
      requests: get(this.props.detail, 'limit.defaultRequest', {}),
      limits: get(this.props.detail, 'limit.default', {}),
    }
  }

  handleChange = data => {
    this.setState({
      data: {
        default: data.limits,
        defaultRequest: data.requests,
      },
    })
  }

  handleOk = () => {
    const { onOk } = this.props
    onOk(this.state.data)
  }

  handleError = error => this.setState({ error })

  render() {
    const { visible, onCancel, isSubmitting } = this.props
    const { error } = this.state
    return (
      <Modal
        width={791}
        title={t('Container Resource Default Request')}
        icon="firewall"
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
        disableSubmit={!!error}
      >
        <ResourceLimit
          defaultValue={this.resourceLimit}
          onChange={this.handleChange}
          onError={this.handleError}
        />
      </Modal>
    )
  }
}
