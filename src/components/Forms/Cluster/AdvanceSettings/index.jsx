import React from 'react'
import { get } from 'lodash'
import { Input, Form } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

import Title from '../Title'
import KSSettings from './KSSettings'

export default class ClusterSettings extends React.Component {
  render() {
    const { store, formRef, formTemplate } = this.props
    return (
      <div className={styles.wrapper}>
        <Title
          title={t('Advanced Settings')}
          description={t('CLUSTER_ADVANCED_SETTINGS_DESC')}
        />
        <Form className={styles.form} data={formTemplate} ref={formRef}>
          <Form.Group
            label={t('KubeSphere Settings')}
            desc={t('CLUSTER_KUBESPHERE_SETTINGS_DESC')}
            checkable
            keepDataWhenUnCheck
          >
            <Form.Item>
              <KSSettings
                name="spec.addons[1].sources.chart.values"
                components={get(
                  store.kubekey,
                  'parameters.kubesphere.components',
                  []
                )}
              />
            </Form.Item>
          </Form.Group>
          <Form.Group
            label={t('Private Registry Configuration')}
            desc={t('CLUSTER_PRIVATE_REGISTRY_DESC')}
            checkable
            keepDataWhenUnCheck
          >
            <Form.Item label={t('Private Registry')}>
              <Input name="spec.registry.privateRegistry" />
            </Form.Item>
          </Form.Group>
          <Form.Group
            label={t('CLUSTER_CONTROLPLANE_ENDPOINT')}
            desc={t('CLUSTER_CONTROLPLANE_ENDPOINT_DESC')}
            checkable
            keepDataWhenUnCheck
          >
            <Form.Item label={t('Domain')}>
              <Input name="spec.controlPlaneEndpoint.domain" />
            </Form.Item>
            <Form.Item label={t('Address')}>
              <Input name="spec.controlPlaneEndpoint.address" />
            </Form.Item>
            <Form.Item label={t('Port')}>
              <NumberInput
                name="spec.controlPlaneEndpoint.port"
                integer
                min={0}
                max={65535}
              />
            </Form.Item>
          </Form.Group>
          <Form.Group
            label={t('etcd Backup')}
            desc={t('CLUSTER_ETCD_BACKUP_DESC')}
            checkable
            keepDataWhenUnCheck
          >
            <Form.Item
              label={t('etcd Backup Dir')}
              desc={t('CLUSTER_ETCD_BACKUP_DIR_DESC')}
            >
              <Input name="spec.kubernetes.etcdBackupDir" />
            </Form.Item>
            <Form.Item
              label={t('etcd Backup Period')}
              desc={t('CLUSTER_ETCD_BACKUP_PERIOD_DESC')}
            >
              <NumberInput
                name="spec.kubernetes.etcdBackupPeriod"
                integer
                min={0}
              />
            </Form.Item>
            <Form.Item
              label={t('Keep Backup Number')}
              desc={t('CLUSTER_ETCD_BACKUP_NUMBER_DESC')}
            >
              <NumberInput
                name="spec.kubernetes.keepBackupNumber"
                integer
                min={0}
              />
            </Form.Item>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
