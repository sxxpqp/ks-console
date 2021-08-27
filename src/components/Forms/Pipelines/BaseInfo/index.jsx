import React from 'react'
import { Column, Columns, Form, Input, TextArea } from '@kube-design/components'
import { PATTERN_NAME } from 'utils/constants'

import RepoSelect from '../RepoSelect'
import RepoSelectForm from '../RepoSelect/subForm'

export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showSelectRepo: false,
    }
    this.scmRef = React.createRef()
  }

  showSelectRepo = () => {
    this.setState({
      showSelectRepo: true,
    })
  }

  hideSelectRepo = () => {
    this.setState({
      showSelectRepo: false,
    })
  }

  handleRepoChange = (source_type, formData) => {
    this.setState(
      {
        showSelectRepo: false,
      },
      () => {
        this.scmRef.current.onChange({
          source_type,
          ...formData,
        })
      }
    )
  }

  handleDeleteSource = () => {
    this.scmRef.current.onChange()
  }

  validator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkPipelineName({
        name: value,
        cluster: this.props.cluster,
        devops: this.props.devops,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            field: rule.field,
            message: t('This name has existed.'),
          })
        }
        callback()
      })
  }

  renderRepoSelectForm() {
    const { formTemplate, devops, cluster } = this.props
    return (
      <RepoSelectForm
        sourceData={formTemplate['multi_branch_pipeline']}
        devops={devops}
        name={formTemplate.name}
        cluster={cluster}
        onSave={this.handleRepoChange}
        onCancel={this.hideSelectRepo}
      />
    )
  }

  render() {
    const { formRef, formTemplate } = this.props
    const { showSelectRepo } = this.state
    if (showSelectRepo) {
      return this.renderRepoSelectForm()
    }

    return (
      <Form ref={formRef} data={formTemplate}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Name')}
              desc={t(
                'The name of the pipeline. Pipelines in the same project must have different names.'
              )}
              rules={[
                { required: true, message: t('Please input pipeline name') },
                {
                  pattern: PATTERN_NAME,
                  message: t('Invalid name', { message: t('NAME_DESC') }),
                },
                { validator: this.validator },
              ]}
            >
              <Input name="name" maxLength={63} />
            </Form.Item>
            <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
              <TextArea name="description" maxLength={256} />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('Project')} desc={t('PROJECT_DESC')}>
              <Input name="devopsName" disabled />
            </Form.Item>
          </Column>
        </Columns>
        <Form.Item label={`${t('Code Repository')} (${t('optional')})`}>
          <RepoSelect
            name="multi_branch_pipeline"
            ref={this.scmRef}
            onClick={this.showSelectRepo}
            handleDeleteSource={this.handleDeleteSource}
            devops={this.props.devops}
          />
        </Form.Item>
      </Form>
    )
  }
}
