import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'components/Base'
import { get } from 'lodash'

import FormSetting from 'components/Forms/Pipelines/AdvanceSettings'

const ENABLE_PARAMS = [
  'discarder',
  'timer_trigger',
  'remote_trigger',
  'regex_filter',
  'multibranch_job_trigger',
]

export default class EditPipelineConfig extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    branches: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()
    this.state = {
      formTemplate: {},
    }
  }

  static defaultProps = {
    branches: [],
    visible: false,
    onOk() {},
    onCancel() {},
  }

  componentDidMount() {
    this.setEnableFlag(this.props.formTemplate)
  }

  setEnableFlag = formTemplate => {
    const { pipeline, multi_branch_pipeline } = formTemplate || {}
    const scmData = pipeline || multi_branch_pipeline

    if (!scmData) return

    ENABLE_PARAMS.forEach(param => {
      const hasData =
        scmData[param] ||
        get(scmData, `svn_source.${param}`) ||
        get(scmData, `git_source.${param}`) ||
        get(scmData, `github_source.${param}`) ||
        get(scmData, `gitlab_source.${param}`) ||
        get(scmData, `bitbucket_server_source.${param}`) ||
        get(scmData, 'multibranch_job_trigger')

      if (scmData[param] || hasData) {
        formTemplate[`enable_${param}`] = true
      }
    })

    formTemplate.description = scmData.description

    this.setState({
      formTemplate,
    })
  }

  handleOk = () => {
    const form = this.formRef && this.formRef.current

    form &&
      form.validate(() => {
        this.props.onOk(this.formRef.current.getData())
      })
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal
        width={1162}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={t('Edit Pipeline')}
      >
        <FormSetting
          type="edit"
          formRef={this.formRef}
          formTemplate={this.state.formTemplate}
          devops={this.props.devops}
          cluster={this.props.cluster}
        />
      </Modal>
    )
  }
}
