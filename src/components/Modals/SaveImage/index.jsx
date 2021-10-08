/* eslint-disable no-console */
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
// import { Input, Form, TextArea, Select } from '@kube-design/components'
// import classnames from 'classnames'
import { Modal } from 'components/Base'

// import { PATTERN_NAME } from 'utils/constants'
// import { TreeSelect, Input as AInput } from 'antd'
import { get } from 'lodash'
import { parseDockerImage } from 'utils'

import ConfigMapStore from 'stores/configmap'
import SecretStore from 'stores/secret'
import LimitRangeStore from 'stores/limitrange'
import ImageInput from './ImageInput'
import styles from './index.scss'

@observer
export default class SaveImageModal extends React.Component {
  constructor(props) {
    super(props)
    console.log(
      '🚀 ~ file: index.jsx ~ line 24 ~ SaveImageModal ~ constructor ~ props',
      props
    )
    this.configMapStore = new ConfigMapStore()
    this.secretStore = new SecretStore()
    this.limitRangeStore = new LimitRangeStore()
    this.imageRegistryStore = new SecretStore()
  }

  static propTypes = {
    // store: PropTypes.object,
    // module: PropTypes.string,
    // roleTemplates: PropTypes.array,
    // formTemplate: PropTypes.object,
    title: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    module: 'roles',
    onOk() {},
    onCancel() {},
  }

  state = {
    configMaps: [],
    secrets: [],
    limitRange: [],
    imageRegistries: [],
    imageInfo: {},
    isSubmitting: false,
  }

  fetchData() {
    const { cluster, isFederated, namespace } = this.props.match.params
    const params = {
      cluster,
      namespace,
    }

    Promise.all([
      this.configMapStore.fetchListByK8s(params),
      this.secretStore.fetchListByK8s(params),
      this.limitRangeStore.fetchListByK8s(params),
      isFederated
        ? this.imageRegistryStore.fetchList({
            ...params,
            limit: -1,
            type: `kubernetes.io/dockerconfigjson`,
          })
        : this.imageRegistryStore.fetchListByK8s({
            ...params,
            fieldSelector: `type=kubernetes.io/dockerconfigjson`,
          }),
    ]).then(([configMaps, secrets, limitRanges, imageRegistries]) => {
      this.setState({
        configMaps,
        secrets,
        limitRange: get(limitRanges, '[0].limit'),
        imageRegistries,
      })
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  get imageRegistries() {
    return this.state.imageRegistries.map(item => {
      const auths = get(item, 'data[".dockerconfigjson"].auths', {})
      const url = Object.keys(auths)[0] || ''
      const username = get(auths[url], 'username')
      const cluster = item.isFedManaged
        ? get(item, 'clusters[0].name')
        : item.cluster

      return {
        url,
        username,
        label: item.name,
        value: item.name,
        cluster,
      }
    })
  }

  onChange = params => {
    this.setState({
      imageInfo: params,
    })
  }

  renderImageForm = () => {
    const { data, namespace, rootStore } = this.props
    const imageRegistries = this.imageRegistries
    const formTemplate = this.getFormTemplate(data, imageRegistries)
    return (
      <ImageInput
        className={styles.imageSearch}
        name="image"
        namespace={namespace}
        formTemplate={formTemplate}
        imageRegistries={imageRegistries}
        rootStore={rootStore}
        onChange={this.onChange}
      />
    )
  }

  getFormTemplate(data, imageRegistries) {
    if (data && data.image && !data.pullSecret) {
      const { registry } = parseDockerImage(data.image)
      if (registry) {
        const reg = imageRegistries.find(({ url }) => url.endsWith(registry))
        if (reg) {
          data.pullSecret = reg.value
        }
      }
    }
    return data
  }

  render() {
    const { title, visible, onCancel, onOk, formTemplate } = this.props
    const { imageInfo } = this.state

    const formRef = React.createRef()
    const handleOk = data => {
      // console.log(formRef)
      this.setState({
        isSubmitting: true,
      })
      onOk({
        ...data,
        ...imageInfo,
      })
    }

    return (
      <Modal.Form
        width={600}
        title={title}
        icon="role"
        data={formTemplate}
        onCancel={onCancel}
        onOk={handleOk}
        okText={'确定'}
        visible={visible}
        ref={formRef}
        isSubmitting={this.state.isSubmitting}
      >
        {this.renderImageForm()}
        {/* <Form.Item label="菜单地址" name="path">
          <Input name="path" maxLength={255} />
        </Form.Item>
        <Form.Item label="菜单路由" name="route">
          <Input name="route" maxLength={255} />
        </Form.Item>
        <Form.Item label="排序">
          <Input name="sort" defaultValue={50} maxLength={255} />
        </Form.Item>
        <Form.Item label="菜单图标" name="icon">
          <div>
            <AInput
              className={classnames(styles['max-width'])}
              addonAfter={this.renderIcons()}
              name="icon"
              value={icon || formTemplate.icon}
            />
          </div>
        </Form.Item>
        <Form.Item label="备注" desc={t('DESCRIPTION_DESC')} name="remark">
          <TextArea name="remark" maxLength={256} />
        </Form.Item> */}
      </Modal.Form>
    )
  }
}
