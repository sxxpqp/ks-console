import { get, set } from 'lodash'
import { toJS } from 'mobx'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import FORM_TEMPLATES from 'utils/form.templates'

import EditModal from 'projects/containers/CustomMonitoring/EditDashborad'
import CreateModal from 'projects/containers/CustomMonitoring/CreateDashborad'

export default {
  'custom.monitoring.create': {
    on({ store, cluster, namespace, module, success, ...props }) {
      const formTemplate = FORM_TEMPLATES[module]({ namespace })
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            return
          }

          store
            .create(data, {
              cluster,
              namespace: namespace || get(data, 'metadata.namespace'),
            })
            .then(() => {
              Modal.close(modal)
              Notify.success({ content: `${t('Created Successfully')}` })
              success && success()
            })
        },
        module,
        cluster,
        namespace,
        modal: CreateModal,
        formTemplate,
        store,
        ...props,
      })
    },
  },
  'custom.monitoring.edit': {
    on({ store, detail, cluster, namespace, success, ...props }) {
      Modal.open({
        onOk: data => {
          set(data, 'metadata.resourceVersion', detail.resourceVersion)
          store.update(detail, data).then(() => {
            Notify.success({ content: `${t('Updated Successfully')}` })
            success && success()
          })
        },
        store,
        cluster,
        namespace,
        data: toJS(detail._originData),
        modal: EditModal,
        ...props,
      })
    },
  },
}
