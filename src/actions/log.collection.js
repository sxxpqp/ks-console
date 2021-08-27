import React from 'react'
import { cloneDeep } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import EnableForm from 'components/Forms/LoggingCollection/Status'
import ESForm from 'components/Forms/Elasticsearch/Settings'
import KafkaForm from 'components/Forms/KafkaForm/Settings'
import FluentdForm from 'components/Forms/Fluentd/Settings'

export default {
  'log.collection.active.switch': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: async ({ enabled }) => {
          await store.patch(store.detail, {
            metadata: {
              labels: {
                'logging.kubesphere.io/enabled': enabled ? 'true' : 'false',
              },
            },
          })
          Modal.close(modal)
          success && success()
          Notify.success({ content: `${t('Updated Successfully')}` })
        },
        modal: Modal.Form,
        store,
        width: 497,
        icon: 'timed-task',
        title: t('Change Status'),
        children: <EnableForm />,
        ...props,
      })
    },
  },
  'log.collection.edit': {
    on({ store, success, ...props }) {
      const EditFormMap = {
        es: ESForm,
        forward: FluentdForm,
        kafka: KafkaForm,
      }
      const { type } = store.detail
      const EditForm = EditFormMap[type] || null
      const data = cloneDeep(store.detail.config)

      const modal = Modal.open({
        onOk: async params => {
          await store.patch(store.detail, {
            spec: {
              [type]: params,
            },
          })
          Modal.close(modal)
          success && success()
          Notify.success({ content: `${t('Updated Successfully')}` })
        },
        modal: Modal.Form,
        data,
        width: 691,
        icon: 'timed-task',
        title: t('Log Collections'),
        children: <EditForm />,
        store,
        ...props,
      })
    },
  },
}
