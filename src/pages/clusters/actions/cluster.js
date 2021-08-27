import { set, uniqBy } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import ClusterVisibility from 'clusters/components/Modals/ClusterVisibility'

import WorkspaceStore from 'stores/workspace'

export default {
  'cluster.visibility.edit': {
    on({ store, success, cluster, ...props }) {
      const workspaceStore = new WorkspaceStore()
      const modal = Modal.open({
        onOk: async data => {
          if (!data) {
            return Modal.close(modal)
          }

          await store.patch(
            { name: store.detail.name },
            {
              metadata: {
                labels: {
                  'cluster.kubesphere.io/visibility': data.public
                    ? 'public'
                    : 'private',
                },
              },
            }
          )

          const requests = []

          if (data.addWorkspaces) {
            data.addWorkspaces.forEach(item => {
              const formData = {}
              const clusters = item.clusters || []
              set(
                formData,
                'spec.placement.clusters',
                uniqBy([...clusters, { name: cluster.name }], 'name')
              )
              requests.push(workspaceStore.patch(item, formData))
            })
          }
          if (data.deleteWorkspaces) {
            data.deleteWorkspaces.forEach(item => {
              const formData = {}
              const clusters = item.clusters || []
              set(
                formData,
                'spec.placement.clusters',
                clusters.filter(({ name }) => name !== cluster.name)
              )
              requests.push(workspaceStore.patch(item, formData))
            })
          }

          await Promise.all(requests)

          Modal.close(modal)
          success && success()
          Notify.success({ content: `${t('Updated Successfully')}` })
        },
        modal: ClusterVisibility,
        store,
        cluster,
        ...props,
      })
    },
  },
}
