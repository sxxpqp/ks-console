import Providers from 'components/Forms/Cluster/Providers'
import BaseInfo from 'components/Forms/Cluster/BaseInfo'
import Configuration from 'components/Forms/Cluster/Configuration'
import ClusterSettings from 'components/Forms/Cluster/ClusterSettings'
import ServiceComponents from 'components/Forms/Cluster/ServiceComponents'
import AdvanceSettings from 'components/Forms/Cluster/AdvanceSettings'

export const IMPORT_CLUSTER = [
  // {
  //   title: 'How to Add',
  //   component: Providers,
  //   required: true,
  // },
  {
    title: 'Basic Info',
    component: BaseInfo,
    required: true,
  },
  {
    title: 'Cluster Settings',
    component: Configuration,
    required: true,
    isForm: false,
  },
]

export const NEW_CLUSTER = [
  {
    title: 'How to Add',
    component: Providers,
    required: true,
  },
  {
    title: 'Basic Info',
    component: BaseInfo,
    required: true,
  },
  {
    title: 'Cluster Settings',
    component: ClusterSettings,
    required: true,
  },
  {
    title: 'Service Components',
    component: ServiceComponents,
    required: true,
  },
  {
    title: 'Advanced Settings',
    component: AdvanceSettings,
    required: true,
  },
]
