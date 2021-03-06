import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { pick } from 'lodash'

import { Alert, Form, Select } from '@kube-design/components'
import { Modal } from 'components/Base'

import WorkspaceStore from 'stores/workspace'
import UserStore from 'stores/user'

@observer
export default class AssignWorkspaceModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      workspace: '',
    }

    this.formTemplate = {}

    this.workspaceStore = new WorkspaceStore()
    this.memberStore = new UserStore()
  }

  componentDidMount() {
    this.workspaceStore.fetchList()
  }

  getWorkspaces() {
    return this.workspaceStore.list.data.map(item => ({
      label: item.name,
      value: item.name,
    }))
  }

  getUsers() {
    return this.memberStore.list.data.map(item => ({
      label: item.username,
      value: item.username,
    }))
  }

  handleWorkspaceChange = workspace => {
    this.setState({ workspace }, () => {
      this.fetchMembers()
    })
  }

  fetchWorkspaces = async params => this.workspaceStore.fetchList(params)

  fetchMembers = async params => {
    if (this.state.workspace) {
      return this.memberStore.fetchList({
        workspace: this.state.workspace,
        ...params,
      })
    }

    return Promise.resolve({})
  }

  render() {
    return (
      <Modal.Form
        title={t('Assign Workspace')}
        icon="firewall"
        width={691}
        data={this.formTemplate}
        {...this.props}
      >
        <Alert
          className="margin-b12"
          type="info"
          message={t('PROJECT_ASSIGN_DESC')}
        />
        <Form.Item label={t('Target Workspace')} desc={t('Choose a workspace')}>
          <Select
            name="metadata.labels['kubesphere.io/workspace']"
            onChange={this.handleWorkspaceChange}
            options={this.getWorkspaces()}
            pagination={pick(this.workspaceStore.list, [
              'page',
              'total',
              'limit',
            ])}
            isLoading={this.workspaceStore.list.isLoading}
            onFetch={this.fetchWorkspaces}
            searchable
            clearable
          />
        </Form.Item>
        <Form.Item
          label={t('Project Manager')}
          desc={t(
            'Select a user of the workspace as the manager of the project.'
          )}
        >
          <Select
            name="metadata.annotations['kubesphere.io/creator']"
            options={this.getUsers()}
            pagination={pick(this.memberStore.list, ['page', 'total', 'limit'])}
            isLoading={this.memberStore.list.isLoading}
            onFetch={this.fetchMembers}
            searchable
            clearable
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
