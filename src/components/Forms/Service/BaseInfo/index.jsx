import { get, set } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import {
  Column,
  Columns,
  Form,
  TextArea,
  Input,
  Icon,
  Tooltip,
} from '@kube-design/components'
// import { Input } from 'components/@kube-design'
import { updateLabels, genName, turnName } from 'utils'
import { ProjectSelect } from 'components/Inputs'
// import { pinyin } from 'pinyin-pro'
import {
  PATTERN_SERVICE_NAME,
  PATTERN_SERVICE_VERSION,
  MODULE_KIND_MAP,
} from 'utils/constants'

import ServiceStore from 'stores/service'
import WorkloadStore from 'stores/workload'
import FederatedStore from 'stores/federated'

@observer
export default class ServiceBaseInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showServiceMesh: false,
      selectApp: {},
      metaName: '',
    }

    this.store = new ServiceStore()
    this.workloadStore = new WorkloadStore(props.module)
    if (props.isFederated) {
      this.store = new FederatedStore(this.store)
      this.workloadStore = new FederatedStore(this.workloadStore)
    }
    // formTemplate = this.props.formTemplate.Service
  }

  formTemplate = this.props.formTemplate.Service

  componentDidMount() {
    // set(this.formTemplate, 'metadata.name', genName())
  }

  get workloadKind() {
    const { module, noWorkload } = this.props
    if (noWorkload) {
      return ''
    }

    return MODULE_KIND_MAP[module]
  }

  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get serviceMeshOptions() {
    return [
      { label: t('Off'), value: 'false' },
      { label: t('On'), value: 'true' },
    ]
  }

  handleNameChange = value => {
    const { isFederated, noWorkload } = this.props

    const labels = get(this.formTemplate, 'metadata.labels', {})
    labels.app = value.slice(0, 63)
    updateLabels(
      isFederated ? get(this.formTemplate, 'spec.template') : this.formTemplate,
      'services',
      labels
    )

    if (isFederated) {
      set(this.formTemplate, 'metadata.labels.app', value.slice(0, 63))
    }

    if (!noWorkload) {
      this.updateWorkload(value)
    }
  }

  updateWorkload(value) {
    const { module, formTemplate, isFederated } = this.props
    const labels = get(this.formTemplate, 'metadata.labels', {})
    const namespace = get(this.formTemplate, 'metadata.namespace')
    const workloadName = `${value}-${labels.version}`
    set(formTemplate[this.workloadKind], 'metadata.name', workloadName)
    set(formTemplate[this.workloadKind], 'metadata.namespace', namespace)
    set(formTemplate[this.workloadKind], 'metadata.labels.app', value)
    updateLabels(
      isFederated
        ? get(formTemplate[this.workloadKind], 'spec.template')
        : formTemplate[this.workloadKind],
      module,
      labels
    )

    if (this.workloadKind === 'StatefulSet') {
      set(
        formTemplate[this.workloadKind],
        isFederated ? 'spec.template.spec.serviceName' : 'spec.serviceName',
        value
      )
    }

    if (isFederated) {
      set(
        formTemplate.Service,
        'metadata.annotations["kubesphere.io/workloadName"]',
        workloadName
      )
      set(
        formTemplate.Service,
        'metadata.annotations["kubesphere.io/workloadModule"]',
        module
      )
    }
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.store
      .checkName({
        name: value,
        namespace: this.namespace,
        cluster: this.props.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  versionValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }
    const serviceName = get(this.formTemplate, 'metadata.name')
    const name = `${serviceName}-${value}`
    this.workloadStore
      .checkName({
        name,
        namespace: this.namespace,
        cluster: this.props.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            message: t(
              `${t(this.workloadKind)} ${name} ${t('exists')}, ${t(
                'version number is invalid'
              )}`
            ),
            field: rule.field,
          })
        }
        callback()
      })
  }

  handleVersionChange = value => {
    const serviceName = get(this.formTemplate, 'metadata.name')
    const workloadName = `${serviceName}-${value}`
    const { formTemplate, isFederated } = this.props
    set(formTemplate[this.workloadKind], 'metadata.name', workloadName)
    if (isFederated) {
      set(
        formTemplate.Service,
        'metadata.annotations["kubesphere.io/workloadName"]',
        workloadName
      )
    }
  }

  handleAliasChange(value) {
    // ??????????????????
    const tempName = `${turnName(value)}-${genName(6)}`.toLowerCase()
    set(this.formTemplate, 'metadata.name', tempName)
    this.setState({
      metaName: tempName,
    })
    this.handleNameChange(tempName)
  }

  render() {
    const { formRef, noWorkload, cluster, namespace } = this.props
    const { metaName } = this.state
    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label="??????"
              desc="??????????????????????????????16??????????????????&????????????"
              rules={[
                { required: true, message: '???????????????' },
                {
                  pattern: /^[\u4e00-\u9fa5_a-zA-Z].*$/,
                  message: '????????????????????????????????????',
                },
              ]}
            >
              <Input
                autoFocus={true}
                name="metadata.annotations['kubesphere.io/alias-name']"
                maxLength={16}
                onChange={this.handleAliasChange.bind(this)}
                rules={[{ required: true, message: '?????????????????????' }]}
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              // className="hidden"
              label={
                <>
                  ????????????
                  <Tooltip
                    content={
                      '???????????????????????????????????????????????????????????????????????????????????????'
                    }
                  >
                    <Icon name="question" />
                  </Tooltip>
                </>
              }
              desc={t('SERVICE_NAME_DESC')}
              rules={[
                { required: true, message: t('Please input name') },
                {
                  pattern: PATTERN_SERVICE_NAME,
                  message: t('Invalid name', {
                    message: t('SERVICE_NAME_DESC'),
                  }),
                },
                { validator: this.nameValidator.bind(this) },
              ]}
            >
              <Input
                name="metadata.name"
                onChange={this.handleNameChange.bind(this)}
                maxLength={63}
                value={metaName}
                // value={uuid}
                // disabled
              />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          {!namespace && (
            <Column>
              <Form.Item
                label={t('Project')}
                desc={t('PROJECT_DESC')}
                rules={[
                  { required: true, message: t('Please select a project') },
                ]}
              >
                <ProjectSelect
                  name="metadata.namespace"
                  cluster={cluster}
                  defaultValue={this.namespace}
                />
              </Form.Item>
            </Column>
          )}
          {!noWorkload && (
            <Column>
              <Form.Item
                label={t('Version')}
                desc={t('COMPONENT_VERSION_DESC')}
                rules={[
                  { required: true, message: t('COMPONENT_VERSION_DESC') },
                  {
                    pattern: PATTERN_SERVICE_VERSION,
                    message: t('COMPONENT_VERSION_DESC'),
                  },
                  { validator: this.versionValidator.bind(this) },
                ]}
              >
                <Input
                  name="metadata.labels.version"
                  defaultValue="v1"
                  maxLength={16}
                  onChange={this.handleVersionChange}
                />
              </Form.Item>
            </Column>
          )}
        </Columns>
        <Columns>
          <Column>
            <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
              <TextArea
                name="metadata.annotations['kubesphere.io/description']"
                maxLength={256}
              />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}
