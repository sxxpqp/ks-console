import BaseInfo from 'components/Forms/Workload/BaseInfo'
import RouteRules from 'components/Forms/Route/RouteRules'
import AdvanceSettings from 'components/Forms/Route/AdvanceSettings'

export default [
  { title: 'Basic Info', icon: 'cdn', component: BaseInfo, required: true },
  { title: 'Route Rules', icon: 'cdn', component: RouteRules, required: true },
  {
    title: 'Advanced Settings',
    icon: 'slider',
    component: AdvanceSettings,
    required: true,
  },
]
