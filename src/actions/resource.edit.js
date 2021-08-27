import { toJS } from 'mobx'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import EditBasicInfoModal from 'components/Modals/EditBasicInfo'
import EditYamlModal from 'components/Modals/EditYaml'
import { set } from 'lodash'

export default {
  'resource.baseinfo.edit': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          store.patch(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}` })
            success && success()
          })
        },
        detail: toJS(detail._originData || detail),
        modal: EditBasicInfoModal,
        store,
        ...props,
      })
    },
  },
  'resource.yaml.edit': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          set(data, 'metadata.resourceVersion', detail.resourceVersion)
          await store.update(detail, data)
          Notify.success({ content: `${t('Updated Successfully')}` })
          Modal.close(modal)
          success && success()
        },
        detail,
        store,
        modal: EditYamlModal,
        ...props,
      })
    },
  },
}
