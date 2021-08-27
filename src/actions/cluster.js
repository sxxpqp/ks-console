import { get, set, unset, cloneDeep } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import CreateModal from 'components/Modals/FullCreate'
import { IMPORT_CLUSTER } from 'configs/steps/clusters'
import { IMPORT_CLUSTER_SPEC } from 'components/Forms/Cluster/constants'
import KubeKeyClusterStore from 'stores/cluster/kubekey'
import { safeParseJSON } from 'utils'

export default {
  'cluster.add': {
    on({ store, module, success, ...props }) {
      store.kubekey = new KubeKeyClusterStore()
      const formTemplate = cloneDeep(IMPORT_CLUSTER_SPEC)
      const modal = Modal.open({
        onOk: async newObject => {
          if (!newObject) {
            return
          }

          const type = get(
            newObject,
            'metadata.annotations["kubesphere.io/way-to-add"]'
          )
          const name = get(newObject, 'metadata.name')

          if (type === 'new') {
            await handleCreate(store.kubekey, newObject)
          } else {
            await handleImport(store, newObject)
          }

          Modal.close(modal)
          Notify.success({ content: `${t('Created Successfully')}` })
          success && success(`/clusters/${name}`)
        },
        module,
        formTemplate,
        title: t('Add Cluster'),
        steps: IMPORT_CLUSTER,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
}

const handleImport = async (store, data) => {
  const postData = cloneDeep(data)

  if (get(postData, 'spec.connection.type') === 'proxy') {
    unset(postData, 'spec.connection.kubeconfig')
  } else {
    const config = get(postData, 'spec.connection.kubeconfig', '')
    set(postData, 'spec.connection.kubeconfig', btoa(config))
    await store.validate(postData)
  }

  await store.create(postData)
}

const handleCreate = (store, data) => {
  let registry = get(data, 'spec.registry.privateRegistry', '')
  if (registry) {
    registry = `${registry}/`.replace(/\/\/$/, '/')
  }
  const replaceKey = /\$\{spec\.registry\.privateRegistry\}/g
  const formatData = safeParseJSON(
    JSON.stringify(data).replace(replaceKey, registry),
    {}
  )
  return store.create(formatData)
}
