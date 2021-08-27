import { Modal } from 'components/Base'
import { Notify } from '@kube-design/components'
import CredentialCreateModal from 'components/Modals/CredentialCreate'

export default {
  'devops.credential.create': {
    on({ store, success, cluster, workspace, devops, formTemplate, ...props }) {
      const modal = Modal.open({
        onOk: async (data, cb) => {
          await store.handleCreate(data, { devops, cluster }).finally(() => {
            cb && cb()
          })
          Modal.close(modal)
          Notify.success({ content: `${t('Created Successfully')}` })
          success && success()
        },
        store,
        cluster,
        workspace,
        devops,
        formTemplate,
        modal: CredentialCreateModal,
        ...props,
      })
    },
  },
  'devops.credential.edit': {
    on({ store, success, cluster, workspace, devops, formTemplate, ...props }) {
      const modal = Modal.open({
        onOk: async (data, cb) => {
          await store
            .updateCredential(data, { devops, cluster })
            .finally(() => {
              cb && cb()
            })
          Modal.close(modal)
          Notify.success({ content: `${t('Update Successfully')}` })
          success && success()
        },
        store,
        cluster,
        workspace,
        devops,
        formTemplate,
        modal: CredentialCreateModal,
        ...props,
      })
    },
  },
}
