import StorageClassBaseInfo from 'components/Forms/StorageClass/BaseInfo'
import ProvisionerSettings from 'components/Forms/StorageClass/ProvisionerSettings'
import StorageClassSettings from 'components/Forms/StorageClass/StorageClassSettings'

export default [
  { title: 'Basic Info', component: StorageClassBaseInfo, required: true },
  {
    title: 'Storage System',
    component: ProvisionerSettings,
    required: true,
  },
  {
    title: 'Storage Class Settings',
    component: StorageClassSettings,
    required: true,
  },
]
