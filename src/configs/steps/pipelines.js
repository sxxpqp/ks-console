import BaseInfo from 'components/Forms/Pipelines/BaseInfo'
import AdvanceSettings from 'components/Forms/Pipelines/AdvanceSettings'

export default [
  { title: 'Basic Info', component: BaseInfo, required: true },
  {
    title: 'Advanced Settings',
    component: AdvanceSettings,
    required: true,
  },
]
