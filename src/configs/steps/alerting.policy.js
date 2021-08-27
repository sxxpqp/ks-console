import BaseInfo from 'components/Forms/AlertingPolicy/BaseInfo'
import AlertingRule from 'components/Forms/AlertingPolicy/AlertingRule'
import NotificationRule from 'components/Forms/AlertingPolicy/NotificationRule'

export default [
  { title: 'Basic Info', component: BaseInfo, required: true },
  {
    title: 'Alerting Rule',
    component: AlertingRule,
    required: true,
  },
  {
    title: 'Notification Settings',
    component: NotificationRule,
    required: true,
  },
]
