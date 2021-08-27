import { withProps } from 'utils'

import BaseInfo from 'components/Forms/Workload/BaseInfo'
import ConfigMapSettings from 'components/Forms/ConfigMap/ConfigMapSettings'

export default [
  {
    title: 'Basic Info',
    component: withProps(BaseInfo, { maxNameLength: 63 }),
    required: true,
  },
  {
    title: 'ConfigMap Settings',
    component: ConfigMapSettings,
    required: true,
  },
]
