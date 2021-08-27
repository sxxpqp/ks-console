import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { get, pick } from 'lodash'
import {
  Column,
  Columns,
  Form,
  Input,
  Select,
  Tag,
  TextArea,
} from '@kube-design/components'
import { compareVersion } from 'utils/app'
import { PATTERN_SERVICE_NAME } from 'utils/constants'
import { Text } from 'components/Base'

import Placement from './Placement'

import styles from './index.scss'

@observer
export default class BasicInfo extends React.Component {
  @computed
  get sortedVersions() {
    return this.props.versionStore.list.data
      .map(version => ({
        label: version.name,
        value: version.version_id,
      }))
      .sort((v1, v2) => compareVersion(v2.name, v1.name))
  }

  @computed
  get latestVersion() {
    return get(this.sortedVersions, '[0].value', '')
  }

  versionOptionRender = ({ label, value }) => (
    <span style={{ display: 'flex', alignItem: 'center' }}>
      {label}&nbsp;&nbsp;
      {value === this.latestVersion && (
        <Tag type="warning">{t('Latest Version')}</Tag>
      )}
    </span>
  )

  fetchVersions = async (params = {}) => {
    const { appId, versionStore, fromStore } = this.props
    return versionStore.fetchList({
      ...params,
      app_id: appId,
      status: fromStore ? 'active' : undefined,
    })
  }

  handleVersionChange = version_id => {
    this.props.fileStore.fetch({ version_id })
  }

  renderStaticPlacement() {
    const { cluster, namespace, workspace } = this.props
    return (
      <div className={styles.placementWrapper}>
        <div className={styles.placementContent}>
          <Text title={workspace} description={t('Workspace')} />
          <Text title={cluster} description={t('Cluster')} />
          <Text icon="project" title={namespace} description={t('Project')} />
        </div>
      </div>
    )
  }

  render() {
    const { formData, formRef, namespace, versionStore } = this.props
    return (
      <div className={styles.wrapper}>
        <Form data={formData} ref={formRef}>
          <div className={styles.title}>{t('Basic Info')}</div>
          <Columns>
            <Column>
              <Form.Item
                label={t('Application Name')}
                desc={t('CLUSTER_NAME_DESC')}
                rules={[
                  { required: true, message: t('Please input name') },
                  {
                    pattern: PATTERN_SERVICE_NAME,
                    message: t('Invalid name', {
                      message: t('CLUSTER_NAME_DESC'),
                    }),
                  },
                ]}
              >
                <Input name="name" maxLength={14} />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item
                label={t('Application Version')}
                rules={[
                  { required: true, message: t('Please select version') },
                ]}
              >
                <Select
                  name="version_id"
                  options={this.sortedVersions}
                  placeholder={t('Please select version')}
                  pagination={pick(versionStore.list, [
                    'page',
                    'limit',
                    'total',
                  ])}
                  isLoading={versionStore.list.isLoading}
                  onFetch={this.fetchVersions}
                  onChange={this.handleVersionChange}
                  optionRenderer={this.versionOptionRender}
                  valueRenderer={this.versionOptionRender}
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            <Column>
              <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
                <TextArea name="description" maxLength={256} />
              </Form.Item>
            </Column>
            <Column />
          </Columns>
          <br />
          <div className={styles.title}>{t('Deployment Location')}</div>
          <div className={styles.placement}>
            {!namespace ? (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: t('Please select a project to deploy'),
                  },
                ]}
              >
                <Placement name="namespace" {...this.props} />
              </Form.Item>
            ) : (
              this.renderStaticPlacement()
            )}
          </div>
        </Form>
      </div>
    )
  }
}
