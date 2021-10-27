import React from 'react'
import { get, set, omit, unset } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form, Toggle } from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import PodIPRange from 'components/Forms/Workload/AdvanceSettings/PodIPRange'

import classnames from 'classnames'
import Metadata from './Metadata'
import NodeSchedule from './NodeSchedule'
import InternetAccess from './InternetAccess'
import styles from './index.scss'

export default class AdvancedSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      advanceMode: false,
    }
  }

  get namespace() {
    return get(this.props.formTemplate, 'Service.metadata.namespace')
  }

  get fedPrefix() {
    return this.props.isFederated ? 'spec.template.' : ''
  }

  get kind() {
    const { module } = this.props
    return MODULE_KIND_MAP[module]
  }

  handleLabelsChange = labels => {
    const { formTemplate, noWorkload } = this.props
    if (!noWorkload) {
      set(
        formTemplate,
        `Service.${this.fedPrefix}spec.selector`,
        omit(labels, 'version')
      )
      set(formTemplate, `Service.${this.fedPrefix}metadata.labels`, labels)
      set(formTemplate, `Service.metadata.labels`, labels)
    }
  }

  handleSessionAffinityChange = value => {
    const { formTemplate } = this.props

    set(
      formTemplate,
      `Service.${this.fedPrefix}spec.sessionAffinity`,
      value ? 'ClientIP' : 'None'
    )

    if (value) {
      set(
        formTemplate,
        `Service.${this.fedPrefix}spec.sessionAffinityConfig.clientIP.timeoutSeconds`,
        10800
      )
    } else {
      unset(formTemplate, `Service.${this.fedPrefix}spec.sessionAffinityConfig`)
    }
  }

  handleModeChange = () => {
    const { advanceMode } = this.state
    this.setState({
      advanceMode: !advanceMode,
    })
  }

  renderToggle() {
    const { advanceMode } = this.state

    return (
      <span>
        <Toggle onChange={this.handleModeChange} checked={advanceMode} />
      </span>
    )
  }

  renderTitle() {
    return (
      <div
        // className={styles.switch}
        className={classnames(styles.switch, 'font-bold margin-b12')}
      >
        <span>{'高级设置'}</span>
        <span className="text-secondary align-middle">
          {this.renderToggle()}
          {` 全部配置 `}
        </span>
      </div>
    )
  }

  render() {
    const { advanceMode } = this.state
    const {
      formRef,
      formTemplate,
      cluster,
      module,
      store,
      noWorkload,
      isFederated,
    } = this.props
    return (
      <>
        {this.renderTitle()}
        <Form data={formTemplate} ref={formRef}>
          {!noWorkload &&
            !isFederated &&
            globals.app.hasClusterModule(cluster, 'network.ippool') && (
              <PodIPRange
                cluster={cluster}
                namespace={this.namespace}
                prefix={`${this.kind}.${this.fedPrefix}spec.template.`}
              />
            )}
          {(noWorkload || module !== 'statefulsets') && (
            <Form.Group
              label={t('Internet Access')}
              desc={t('SERVICES_INTERNET_ACCESS_DESC')}
              checkable
            >
              <InternetAccess
                formTemplate={formTemplate}
                isFederated={isFederated}
              />
            </Form.Group>
          )}
          {advanceMode && (
            <Form.Group
              label={t('Enable Sticky Session')}
              desc={t('The maximum session sticky time is 10800s (3 hours).')}
              onChange={this.handleSessionAffinityChange}
              checkable
            >
              <Form.Item
                label={t('Maximum Session Sticky Time (s)')}
                desc={t('SERVICE_SESSION_STICKY_DESC')}
              >
                <NumberInput
                  name={`Service.${this.fedPrefix}spec.sessionAffinityConfig.clientIP.timeoutSeconds`}
                  min={0}
                  max={86400}
                />
              </Form.Item>
            </Form.Group>
          )}
          {advanceMode && !noWorkload && (
            <Form.Group
              label={t('Set Node Scheduling Policy')}
              desc={t('You can allow Pod replicas to run on specified nodes.')}
              checkable
            >
              <NodeSchedule
                kind={this.kind}
                cluster={cluster}
                namespace={this.namespace}
                formTemplate={formTemplate}
                isFederated={isFederated}
              />
            </Form.Group>
          )}
          <Form.Group
            label={t('Add Metadata')}
            desc={t(
              'Additional metadata settings for resources such as Labels and Annotations.'
            )}
            keepDataWhenUnCheck
            checkable
          >
            <Metadata
              store={store}
              module={module}
              kind={this.kind}
              namespace={this.namespace}
              cluster={cluster}
              formTemplate={formTemplate}
              onLabelsChange={this.handleLabelsChange}
              isFederated={isFederated}
              noWorkload={noWorkload}
            />
          </Form.Group>
        </Form>
      </>
    )
  }
}
