import React from 'react'
import { Alert, Form } from '@kube-design/components'

import UserGroup from '../ContainerForm/SecurityContext/UserGroup'
import SELinuxOptions from '../ContainerForm/SecurityContext/SELinuxOptions'

export default class PodSecurityContext extends React.PureComponent {
  render() {
    return (
      <Form.Group
        label={t('Pod Security Context')}
        desc={t('CONTAINER_SECURITY_CTX_DESC')}
        checkable
      >
        <Alert
          className="margin-b12"
          type="warning"
          title={t('ALERT_WARNING')}
          message={t('POD_SECURITY_CONTEXT_DESC')}
        />
        <UserGroup prefix={this.props.prefix} />
        <SELinuxOptions prefix={this.props.prefix} />
      </Form.Group>
    )
  }
}
