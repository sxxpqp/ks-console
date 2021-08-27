import { get } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import DeleteModal from 'components/Modals/Delete'

export default {
  'group.user.remove': {
    on({ store, detail, workspace, success, ...props }) {
      const modal = Modal.open({
        onOk: async () => {
          const result = await store.getGroupBinding(
            { user: detail.name, group: detail.group },
            {
              workspace,
            }
          )
          const name = get(result.items[0], 'metadata.name')
          store.deleteGroupBinding(name, { workspace }).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Deleted Successfully')}` })
            success && success()
          })
        },
        modal: DeleteModal,
        title: t('Sure to remove'),
        desc: t.html('REMOVE_MEMBER_TIP', {
          resource: detail.name,
        }),
        resource: detail.name,
        store,
        ...props,
      })
    },
  },
}
