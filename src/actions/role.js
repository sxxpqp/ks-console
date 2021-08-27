import { set, cloneDeep } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/RoleCreate'
import RoleEditModal from 'components/Modals/EditAuthorization'
import DeleteModal from 'components/Modals/RoleDelete'
import FORM_TEMPLATES from 'utils/form.templates'

export default {
  'role.create': {
    on({ store, cluster, namespace, workspace, success, devops, ...props }) {
      const { module } = store
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          if (devops) {
            data.metadata.namespace = devops
          }

          store
            .create(data, { cluster, namespace, workspace, devops })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: `${t('Created Successfully')}` })
              success && success()
            })
        },
        modal: CreateModal,
        store,
        module,
        cluster,
        namespace,
        workspace,
        formTemplate: FORM_TEMPLATES[module]({ namespace }),
        ...props,
      })
    },
  },
  'role.edit': {
    on({ store, detail, success, ...props }) {
      const { module } = store
      const formTemplate = Object.assign(
        FORM_TEMPLATES[module]({ namespace: props.namespace }),
        cloneDeep(detail._originData)
      )

      set(formTemplate, 'metadata.resourceVersion', detail.resourceVersion)

      formTemplate.roleTemplates = detail.roleTemplates

      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          delete formTemplate.roleTemplates

          set(
            formTemplate,
            'metadata.annotations["iam.kubesphere.io/aggregation-roles"]',
            JSON.stringify(data)
          )

          store.update(detail, formTemplate).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}` })
            success && success()
          })
        },
        modal: RoleEditModal,
        store,
        module,
        edit: true,
        formTemplate,
        ...props,
      })
    },
  },
  'role.delete': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          store.delete(detail).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Delete Successfully')}` })
            success && success()
          })
        },
        modal: DeleteModal,
        module: store.module,
        detail,
        store,
        ...props,
      })
    },
  },
}
