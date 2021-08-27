import React from 'react'
import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'

export default class ImagePullPolicy extends React.Component {
  static defaultProps = {
    prefix: '',
  }

  get prefix() {
    const { prefix } = this.props

    return prefix ? `${prefix}.` : ''
  }

  getImagePullPolicyOptions() {
    return [
      {
        icon: 'timed-task',
        label: t('IMAGE_PULL_POLICY_ALWAYS'),
        value: 'Always',
        description: t('IMAGE_PULL_POLICY_ALWAYS_DESC'),
      },
      {
        icon: 'timed-task',
        label: t('IMAGE_PULL_POLICY_IFNOTPRESENT'),
        value: 'IfNotPresent',
        description: t('IMAGE_PULL_POLICY_IFNOTPRESENT_DESC'),
      },
      {
        icon: 'timed-task',
        label: t('IMAGE_PULL_POLICY_NEVER'),
        value: 'Never',
        description: t('IMAGE_PULL_POLICY_NEVER_DESC'),
      },
    ]
  }

  render() {
    return (
      <Form.Item>
        <TypeSelect
          name={`${this.prefix}imagePullPolicy`}
          defaultValue="IfNotPresent"
          options={this.getImagePullPolicyOptions()}
        />
      </Form.Item>
    )
  }
}
