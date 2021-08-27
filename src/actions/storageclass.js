import { get } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'

import CreateModal from 'components/Modals/Create'
import SetDefaultStorageClassModal from 'components/Modals/SetDefaultStorageClass'
import { MODULE_KIND_MAP } from 'utils/constants'
import FORM_TEMPLATES from 'utils/form.templates'
import formPersist from 'utils/form.persist'
import FORM_STEPS from 'configs/steps/storageclasses'

export default {
  'storageclass.create': {
    on({ store, cluster, module, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({}),
      }

      const modal = Modal.open({
        onOk: newObject => {
          const data = get(newObject, kind)

          if (!data) {
            return
          }

          store.createAlongWithSnapshotClasses(data, { cluster }).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}` })
            success && success()
            formPersist.delete(`${module}_create_form`)
          })
        },
        module,
        cluster,
        name: kind,
        steps: FORM_STEPS,
        formTemplate,
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'storageclass.set.default': {
    on({ store, cluster, detail, defaultStorageClass, success, ...props }) {
      const modal = Modal.open({
        onOk: async () => {
          if (defaultStorageClass) {
            await store.patch(
              { name: defaultStorageClass },
              {
                metadata: {
                  annotations: {
                    'storageclass.kubernetes.io/is-default-class': 'false',
                    'storageclass.beta.kubernetes.io/is-default-class': 'false',
                  },
                },
              }
            )
          }

          await store.patch(detail, {
            metadata: {
              annotations: {
                'storageclass.kubernetes.io/is-default-class': 'true',
                'storageclass.beta.kubernetes.io/is-default-class': 'true',
              },
            },
          })

          Modal.close(modal)
          success && success()
        },
        cluster,
        modal: SetDefaultStorageClassModal,
        store,
        ...props,
      })
    },
  },
}
