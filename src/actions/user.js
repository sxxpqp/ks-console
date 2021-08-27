import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/UserCreate'
import ModifyPasswordModal from 'components/Modals/ModifyPassword'
import UserSettingModal from 'components/Modals/UserSetting'
import set from 'lodash/set'

export default {
  'user.create': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          set(
            data,
            'metadata.annotations["iam.kubesphere.io/uninitialized"]',
            'true'
          )

          await store.create(data)

          Modal.close(modal)
          Notify.success({ content: `${t('Created Successfully')}` })
          success && success()
        },
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'user.edit': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          set(data, 'metadata.resourceVersion', detail.resourceVersion)
          await store.update(detail, data)

          Modal.close(modal)
          Notify.success({ content: `${t('Updated Successfully')}` })
          success && success()
        },
        modal: CreateModal,
        detail,
        store,
        ...props,
      })
    },
  },
  'user.setting': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          if (!data) {
            Modal.close(modal)
            return
          }

          const { currentPassword, password, rePassword, ...rest } = data
          if (currentPassword && password) {
            await store.modifyPassword(
              { name: globals.user.username },
              { currentPassword, password }
            )
            setTimeout(() => {
              location.href = '/login'
            }, 1000)
          } else {
            await store.update({ name: globals.user.username }, rest)
          }

          Modal.close(modal)
          Notify.success({ content: `${t('Updated Successfully')}` })
          success && success()
        },
        modal: UserSettingModal,
        store,
        ...props,
      })
    },
  },
  'user.modifypassword': {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }
          store.modifyPassword(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}` })
            success && success()
          })
        },
        modal: ModifyPasswordModal,
        detail,
        store,
        ...props,
      })
    },
  },
}
