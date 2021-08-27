import React from 'react'
import { Icon } from '@kube-design/components'

import { Modal } from 'components/Base'
import LogModal from 'components/Modals/LogSearch'
import EventModal from 'components/Modals/EventSearch'
import AuditingModal from 'components/Modals/AuditingSearch'
import KubeCtlModal from 'components/Modals/KubeCtl'
import KubeConfigModal from 'components/Modals/KubeConfig'
import BillModal from 'components/Modals/Bill'

export default {
  'toolbox.logquery': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: LogModal,
        title: t('Log Search'),
        ...props,
      })
    },
  },
  'toolbox.eventsearch': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: EventModal,
        title: (
          <div>
            <Icon size={20} name="thunder" style={{ marginRight: 7 }} />{' '}
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: '20px',
                height: '20px',
              }}
            >
              {t('Event Search')}
            </span>
          </div>
        ),
        ...props,
      })
    },
  },
  'toolbox.auditingsearch': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: AuditingModal,
        title: (
          <div>
            <Icon size={20} name="login-servers" style={{ marginRight: 7 }} />{' '}
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: '20px',
                height: '20px',
              }}
            >
              {t('Auditing Operating')}
            </span>
          </div>
        ),
        ...props,
      })
    },
  },
  'toolbox.kubectl': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: KubeCtlModal,
        title: 'Kubectl',
        ...props,
      })
    },
  },
  'toolbox.kubeconfig': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: KubeConfigModal,
        title: t('kubeconfig'),
        ...props,
      })
    },
  },
  'toolbox.bill': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          Modal.close(modal)
        },
        modal: BillModal,
        store,
        ...props,
      })
    },
  },
}
