import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { pick } from 'lodash'
import PropTypes from 'prop-types'

import { Button } from '@kube-design/components'

import { Modal } from 'components/Base'

import Apps from './Apps'
import AppDetail from './AppDetail'

import styles from './index.scss'

@observer
class RepoApp extends Component {
  static propTypes = {
    workspace: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    workspace: '',
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      selectRepo: '',
      viewType: 'appList',
      selectApp: null,
    }
  }

  setViewType = (type = 'appList', selectRepo) => {
    this.setState({ selectRepo, viewType: type })
  }

  handleClickApp = app => {
    this.setState({
      viewType: 'appDetail',
      selectApp: app,
    })
  }

  handleDeploy = (params = {}) => {
    this.props.trigger('openpitrix.template.deploy', {
      ...params,
      ...pick(this.props, ['cluster', 'workspace', 'namespace']),
      success: () => this.props.onOk(),
    })
  }

  render() {
    const { visible, onCancel, workspace, onDeploy, ...rest } = this.props
    const { viewType, selectApp, selectRepo } = this.state

    return (
      <Modal
        width={1070}
        className={styles.modal}
        bodyClassName={styles.body}
        visible={visible}
        onCancel={onCancel}
        rightScreen
        hideHeader
        hideFooter
        {...rest}
      >
        <Button
          className={styles.close}
          icon="close"
          iconType="light"
          type="control"
          onClick={onCancel}
        />
        {viewType === 'appList' && (
          <Apps
            workspace={workspace}
            selectRepo={selectRepo}
            setType={this.setViewType}
            onClickApp={this.handleClickApp}
          />
        )}
        {viewType === 'appDetail' && (
          <AppDetail
            setType={this.setViewType}
            app={selectApp}
            workspace={workspace}
            onDeploy={this.handleDeploy}
          />
        )}
      </Modal>
    )
  }
}

export default RepoApp
