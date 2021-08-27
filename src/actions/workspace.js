import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import { get, omitBy, isEmpty } from 'lodash'
import CreateModal from 'workspaces/components/Modals/WorkspaceCreate'
import WorkspaceQuotaEditModal from 'workspaces/components/Modals/QuotaEdit'

import QuotaStore from 'stores/workspace.quota'

export default {
  'workspace.create': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          store.create(data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}` })
            success && success()
          })
        },
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'workspace.quota.edit': {
    on({ store, detail, success, ...props }) {
      const quotaStore = new QuotaStore()
      const modal = Modal.open({
        onOk: async data => {
          const params = {
            name: detail.name,
            workspace: detail.name,
            cluster: detail.cluster,
          }

          const spec = get(data, 'spec.quota.hard', {})
          const resp = await quotaStore.checkName(params)

          const template = {
            apiVersion: 'quota.kubesphere.io/v1alpha2',
            kind: 'ResourceQuota',
            metadata: { ...params, name: detail.name },
            spec: { quota: { hard: omitBy(spec, isEmpty) } },
          }

          if (resp.exist) {
            await quotaStore.update(params, template)
          } else {
            await quotaStore.create(template, params)
          }

          Modal.close(modal)

          success && success()
        },
        detail,
        store: quotaStore,
        modal: WorkspaceQuotaEditModal,
        ...props,
      })
    },
  },
}
