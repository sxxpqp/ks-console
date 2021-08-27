import BaseInfo from 'components/Forms/Workload/BaseInfo'
import VolumeSettings from 'components/Forms/Volume/VolumeSettings'
import AdvanceSettings from 'components/Forms/Volume/AdvanceSettings'
import AccessModeSettings from 'components/Forms/Volume/VolumeSettings/AccessModeSelectForm'

export default [
  { title: 'Basic Info', icon: 'cdn', component: BaseInfo, required: true },
  {
    title: 'Volume Settings',
    icon: 'storage',
    component: VolumeSettings,
    required: true,
  },
  {
    title: 'Advanced Settings',
    icon: 'slider',
    component: AdvanceSettings,
    required: true,
  },
]

export const APPLY_SNAPSHOT_FORM_STEPS = [
  { title: 'Basic Info', icon: 'cdn', component: BaseInfo, required: true },
  {
    title: 'Volume Settings',
    icon: 'storage',
    component: AccessModeSettings,
    required: true,
  },
  {
    title: 'Advanced Settings',
    icon: 'slider',
    component: AdvanceSettings,
    required: true,
  },
]
