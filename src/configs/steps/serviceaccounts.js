import { withProps } from 'utils'

import BaseInfo from 'components/Forms/ServiceAccount/BaseInfo'

export default [
  {
    title: 'Basic Info',
    component: withProps(BaseInfo, { maxNameLength: 63 }),
    required: true,
  },
]
