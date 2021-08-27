import { withProps } from 'utils'

import BaseInfo from 'components/Forms/CronJob/BaseInfo'
import JobSettings from 'components/Forms/Job/JobSettings'
import ContainerSettings from 'components/Forms/Job/ContainerSettings'
import VolumeSettings from 'components/Forms/Workload/VolumeSettings'
import AdvanceSettings from 'components/Forms/Workload/AdvanceSettings'

export default [
  { title: 'Basic Info', icon: 'cdn', component: BaseInfo, required: true },
  {
    title: 'CronJob Settings',
    icon: 'cron-job',
    component: withProps(JobSettings, { prefix: 'spec.jobTemplate.spec.' }),
    required: true,
  },
  {
    title: 'Container Image',
    icon: 'docker',
    component: withProps(ContainerSettings, {
      prefix: 'spec.jobTemplate.spec.template.',
    }),
    required: true,
  },
  {
    title: 'Mount Volumes',
    icon: 'storage',
    component: withProps(VolumeSettings, {
      prefix: 'spec.jobTemplate.spec.template.',
    }),
    required: true,
  },
  {
    title: 'Advanced Settings',
    icon: 'slider',
    component: withProps(AdvanceSettings, {
      prefix: 'spec.jobTemplate.spec.template.',
    }),
    required: true,
  },
]
