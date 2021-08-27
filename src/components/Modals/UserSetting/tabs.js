import BaseInfo from './BaseInfo'
import PasswordSetting from './PasswordSetting'

export default [
  {
    icon: 'paper',
    name: 'basicInfo',
    title: 'Basic Info',
    component: BaseInfo,
  },
  {
    icon: 'ssh',
    name: 'passwordSetting',
    title: 'Password Setting',
    component: PasswordSetting,
  },
]
