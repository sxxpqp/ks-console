import BaseInfo from 'components/Forms/Workload/BaseInfo'
import ContainerSettings from 'components/Forms/Workload/ContainerSettings'
import VolumeSettings from 'components/Forms/Workload/VolumeSettings'
import AdvanceSettings from 'components/Forms/Workload/AdvanceSettings'

export default [
  { title: 'Basic Info', icon: 'cdn', component: BaseInfo, required: true },
  {
    title: 'Container Image',
    icon: 'docker',
    component: ContainerSettings,
    required: true,
  },
  {
    title: 'Mount Volumes',
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
