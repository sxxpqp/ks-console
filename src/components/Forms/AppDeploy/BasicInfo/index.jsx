import React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { get, pick, set } from 'lodash'
import {
  Column,
  Columns,
  Form,
  Input,
  Select,
  Tag,
  // TextArea,
} from '@kube-design/components'
import { compareVersion } from 'utils/app'
import { PATTERN_SERVICE_NAME } from 'utils/constants'
import { genName, turnName } from 'utils'
import { Text } from 'components/Base'

import Placement from './Placement'

import styles from './index.scss'

@observer
export default class BasicInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      metaName: '',
    }
  }

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

  handleAliasChange(value) {
    const { formData } = this.props
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 84 ~ BasicInfo ~ handleAliasChange ~ formData',
    //   formData
    // )
    // 自动唯一标识
    const tempName = `${turnName(value)}-${genName(6)}`
    set(formData, 'name', tempName)
    set(formData, 'description', value)
    this.setState({
      metaName: tempName,
    })
    // this.handleNameChange(tempName)
  }

  render() {
    const { formData, formRef, namespace, versionStore } = this.props

    const { metaName } = this.state

    return (
      <div className={styles.wrapper}>
        <Form data={formData} ref={formRef}>
          <div className={styles.title}>{t('Basic Info')}</div>
          <Columns>
            <Column>
              <Form.Item
                label="名称"
                desc="支持中英文名称，最长63个字符，汉字&字母打头"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input
                  autoFocus={true}
                  name="metadata.annotations['kubesphere.io/alias-name']"
                  maxLength={63}
                  onChange={this.handleAliasChange.bind(this)}
                  rules={[{ required: true, message: '请输入应用名称' }]}
                />
              </Form.Item>
            </Column>
            <Column className="hidden">
              <Form.Item
                label={'唯一标识'}
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
                <Input name="name" maxLength={14} value={metaName} />
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
          {/* <Columns>
            <Column>
              <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
                <TextArea name="description" maxLength={256} />
              </Form.Item>
            </Column>
            <Column />
          </Columns> */}
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
