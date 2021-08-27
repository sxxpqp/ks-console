import { withProps } from 'utils'

import BaseInfo from 'components/Forms/Workload/BaseInfo'
import SecretSettings from 'components/Forms/Secret/SecretSettings'

export default [
  {
    title: 'Basic Info',
    component: withProps(BaseInfo, { maxNameLength: 63 }),
    required: true,
  },
  {
    title: 'Secret Settings',
    component: SecretSettings,
    required: true,
  },
]
