import UpdateStrategy from 'components/EditForms/Workload/UpdateStrategy'
import PodTemplate from 'components/EditForms/Workload/PodTemplate'
import VolumeSettings from 'components/EditForms/Workload/VolumeSettings'
import Affinity from 'components/EditForms/Workload/Affinity'

export default {
  deployments: [
    {
      icon: 'dashboard',
      name: 'updateStrategy',
      title: 'Update Strategy',
      component: UpdateStrategy,
    },
    {
      icon: 'container',
      name: 'podTemplate',
      title: 'Pod Template',
      component: PodTemplate,
    },
    {
      icon: 'storage',
      name: 'volumeSettings',
      title: 'Volume',
      component: VolumeSettings,
    },
    {
      icon: 'group',
      name: 'deploymentMode',
      title: 'Deployment Mode',
      component: Affinity,
    },
  ],
  statefulsets: [
    {
      icon: 'dashboard',
      name: 'updateStrategy',
      title: 'Update Strategy',
      component: UpdateStrategy,
    },
    {
      icon: 'container',
      name: 'podTemplate',
      title: 'Pod Template',
      component: PodTemplate,
    },
    {
      icon: 'storage',
      name: 'volumeSettings',
      title: 'Volume',
      component: VolumeSettings,
    },
  ],
  daemonsets: [
    {
      icon: 'dashboard',
      name: 'updateStrategy',
      title: 'Update Strategy',
      component: UpdateStrategy,
    },
    {
      icon: 'container',
      name: 'podTemplate',
      title: 'Pod Template',
      component: PodTemplate,
    },
    {
      icon: 'storage',
      name: 'volumeSettings',
      title: 'Volume',
      component: VolumeSettings,
    },
  ],
}
