import React from 'react'
import { Form } from '@kube-design/components'

import AccessControl from './AccessControl'
import UserGroup from './UserGroup'
import SELinuxOptions from './SELinuxOptions'
import Capabilities from './Capabilities'

export default class SecurityContext extends React.PureComponent {
  render() {
    return (
      <Form.Group
        label={t('Container Security Context')}
        desc={t('CONTAINER_SECURITY_CTX_DESC')}
        checkable
      >
        <AccessControl />
        <UserGroup />
        <SELinuxOptions />
        <Capabilities />
      </Form.Group>
    )
  }
}
