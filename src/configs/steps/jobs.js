import { withProps } from 'utils'

import BaseInfo from 'components/Forms/Workload/BaseInfo'
import VolumeSettings from 'components/Forms/Workload/VolumeSettings'
import AdvanceSettings from 'components/Forms/Workload/AdvanceSettings'

import JobSettings from 'components/Forms/Job/JobSettings'
import ContainerSettings from 'components/Forms/Job/ContainerSettings'

export default [
  {
    title: 'Basic Info',
    icon: 'cdn',
    component: withProps(BaseInfo, { maxNameLength: 63 }),
    required: true,
  },
  {
    title: 'Job Settings',
    icon: 'job',
    component: JobSettings,
    required: true,
  },
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
