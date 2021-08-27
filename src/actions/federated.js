import { get, set, unset, cloneDeep, uniqBy } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import FedProjectCreateModal from 'components/Modals/FedProjectCreate'
import DeleteModal from 'components/Modals/Delete'
import FORM_TEMPLATES from 'utils/form.templates'
import FED_TEMPLATES from 'utils/fed.templates'

import FederatedStore from 'stores/federated'
import ProjectStore from 'stores/project'

export default {
  'federated.project.create': {
    on({ store, success, cluster, workspace, clusters, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          set(
            data,
            'metadata.annotations["kubesphere.io/creator"]',
            globals.user.username
          )
          set(data, 'metadata.labels["kubesphere.io/workspace"]', workspace)
          const specClusters = uniqBy(
            get(data, 'spec.placement.clusters', []).filter(item => item.name),
            'name'
          )

          const federatedStore = new FederatedStore(store)
          set(data, 'spec.placement.clusters', specClusters)

          const hostData = cloneDeep(data)
          set(
            hostData,
            'metadata.labels["kubesphere.io/kubefed-host-namespace"]',
            'true'
          )
          set(hostData, 'metadata.labels["kubefed.io/managed"]', 'false')
          unset(hostData, 'spec.placement')
          unset(hostData, 'metadata.annotations')
          await store.create(hostData, { workspace })
          await federatedStore.create(FED_TEMPLATES.namespaces(data), {
            namespace: get(data, 'metadata.name'),
          })

          Modal.close(modal)
          Notify.success({ content: `${t('Created Successfully')}` })
          success && success()
        },
        cluster,
        workspace,
        clusters,
        formTemplate: FORM_TEMPLATES.project(),
        modal: FedProjectCreateModal,
        store,
        ...props,
      })
    },
  },
  'federated.project.delete': {
    on({ store, detail, success, ...props }) {
      const projectStore = new ProjectStore()
      const modal = Modal.open({
        onOk: () => {
          projectStore.delete({ name: detail.name }).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Deleted Successfully')}` })
            success && success()
          })
        },
        store,
        modal: DeleteModal,
        resource: detail.name,
        type: t('Multi-cluster Project'),
        isLoading: projectStore.isLoading,
        ...props,
      })
    },
  },
  'federated.project.delete.batch': {
    on({ store, success, rowKey, ...props }) {
      const projectStore = new ProjectStore()
      const { data, selectedRowKeys } = store.list
      const selectNames = data
        .filter(item => selectedRowKeys.includes(item[rowKey]))
        .map(item => item.name)

      const modal = Modal.open({
        onOk: async () => {
          const reqs = []

          data.forEach(item => {
            if (selectNames.includes(item.name)) {
              reqs.push(projectStore.delete({ name: item.name }))
            }
          })

          await Promise.all(reqs)

          Modal.close(modal)
          Notify.success({ content: `${t('Deleted Successfully')}` })
          store.setSelectRowKeys([])
          success && success()
        },
        resource: selectNames.join(', '),
        modal: DeleteModal,
        store,
        isLoading: projectStore.isLoading,
        ...props,
      })
    },
  },
}
