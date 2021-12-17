import React from 'react'
import { Icon } from '@kube-design/components'
import { set, pick, isEmpty, get } from 'lodash'

import { Modal } from 'components/Base'
import CreateModal from 'components/Modals/Create'
import ClusterDiffSettings from 'components/Forms/Workload/ClusterDiffSettings'

import WorkloadStore from 'stores/workload'

import FORM_STEPS from 'configs/steps/services'
import { withProps } from 'utils'
import FORM_TEMPLATES from 'utils/form.templates'
import { S2I_SUPPORTED_TYPES, B2I_SUPPORTED_TYPES } from 'utils/constants'
import { getLanguageIcon } from 'utils/devops'

import styles from './index.scss'

export default class ServiceCreateModal extends React.Component {
  constructor(props) {
    super(props)
    this.workloadStore = new WorkloadStore()
    this.state = {
      type: '',
      workloadModule: 'deployments',
      groups: [
        {
          name: 'Service Type',
          description: 'SERVICE_TYPE',
          options: [
            {
              icon: 'backup',
              name: 'Stateless Service',
              value: 'statelessservice',
            },
            {
              icon: 'stateful-set',
              name: 'Stateful Service',
              value: 'statefulservice',
            },
          ],
        },
        {
          name: 'SERVICE_FROM_CODE',
          type: 's2i',
          description: 'SERVICE_FROM_CODE_DESC',
          options: S2I_SUPPORTED_TYPES,
        },
        {
          name: 'SERVICE_FROM_ARTIFACTS',
          type: 'b2i',
          description: 'SERVICE_FROM_ARTIFACTS_DESC',
          options: B2I_SUPPORTED_TYPES,
        },
      ],
      s2iType: '',
    }
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props
    if (visible !== prevProps.visible) {
      if (!this.props.visible) {
        this.setState({
          type: '',
          workloadModule: 'deployments',
        })
      } else {
        const detail = this.props.detail || {}
        let type = ''
        let workloadModule = 'deployments'
        if (detail.StatefulSet) {
          type = 'statefulservice'
          workloadModule = 'statefulsets'
        } else if (detail.Deployment) {
          type = 'statelessservice'
        }
        this.setState({ type, workloadModule })
      }
    }
  }

  handleTypeSelect = e => {
    this.setState({
      type: e.currentTarget.dataset.value,
      s2iType: e.currentTarget.dataset.type,
    })
  }

  handleWorkloadModuleChange = workloadModule => {
    this.setState({ workloadModule })
  }

  renderHeader() {
    return (
      <div className={styles.header}>
        <div className="h4 margin-b12">{t('Create Service')}</div>
        <p>{t.html('SERVICE_CREATE_DESC')}</p>
        {/* <img src="/assets/create-service.svg" alt="" /> */}
      </div>
    )
  }

  renderGroups() {
    return (
      <div className={styles.groups}>
        {this.state.groups.map(group => (
          <div key={group.name} className={styles.group}>
            <div className={styles.title}>
              <div>{t(group.name)}</div>
              <p>{t(group.description)}</p>
            </div>
            <ul>
              {group.options &&
                group.options.map(option => (
                  <li
                    key={option.value || option}
                    data-value={option.value || option}
                    data-type={group.type}
                    onClick={this.handleTypeSelect}
                  >
                    <div>
                      <Icon
                        name={option.icon || getLanguageIcon(option, 'radio')}
                        size={48}
                      />
                    </div>
                    <div>{t(option.name || option)}</div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  renderSubModal(type, s2iType) {
    const {
      visible,
      onOk,
      onCancel,
      cluster,
      namespace,
      detail,
      isFederated,
      projectDetail,
      isSubmitting,
      // detail,
    } = this.props

    if (s2iType) {
      const isS2i = s2iType === 's2i'
      // const formTemplate = {
      //   S2i: FORM_TEMPLATES.s2ibuilders({
      //     namespace,
      //     isS2i,
      //     languageType: type,
      //   }),
      //   Deployment: FORM_TEMPLATES.deployments({ namespace }),
      //   Service: FORM_TEMPLATES.services({ namespace }),
      // }
      let formTemplate
      if (!isEmpty(detail)) {
        if (detail.S2iBuilder) {
          formTemplate = {
            ...pick(detail, ['Deployment', 'Service']),
            S2i: detail.S2iBuilder,
          }
          type = get(detail, 'S2iBuilder.metadata.annotations.languageType')
        } else {
          formTemplate = {
            ...pick(detail, ['Deployment', 'Service']),
          }
        }
      } else {
        formTemplate = {
          S2i: FORM_TEMPLATES.s2ibuilders({
            namespace,
            isS2i,
            languageType: type,
          }),
          Deployment: FORM_TEMPLATES.deployments({ namespace }),
          Service: FORM_TEMPLATES.services({ namespace }),
        }
      }

      const steps = isS2i ? FORM_STEPS.s2iservice : FORM_STEPS.b2iservice

      steps[0] = {
        ...steps[0],
        component: withProps(steps[0].component, {
          noApp: true,
        }),
      }
      const description = `${
        isS2i ? t('Language Type') : t('Artifacts Type')
      } : ${t(type)}`

      this.workloadStore.setModule('deployments')

      return (
        <CreateModal
          icon={type}
          title={isS2i ? t('SERVICE_FROM_CODE') : t('SERVICE_FROM_ARTIFACTS')}
          description={description}
          width={960}
          module={this.state.workloadModule}
          store={this.workloadStore}
          name={t('Stateless Service')}
          visible={visible}
          steps={steps}
          cluster={cluster}
          namespace={namespace}
          isFederated={isFederated}
          formTemplate={formTemplate}
          isSubmitting={isSubmitting}
          projectDetail={projectDetail}
          updateModule={this.handleWorkloadModuleChange}
          onOk={onOk}
          onCancel={onCancel}
          maskClosable={false}
          noCodeEdit
        />
      )
    }

    let content

    switch (type) {
      case 'statelessservice': {
        const module = 'deployments'
        const formTemplate = !isEmpty(detail)
          ? pick(detail, ['Deployment', 'Service'])
          : {
              Deployment: FORM_TEMPLATES.deployments({
                namespace,
              }),
              Service: FORM_TEMPLATES.services({ namespace }),
            }

        const steps = [...FORM_STEPS[type]]

        steps[0] = {
          ...steps[0],
          component: withProps(steps[0].component, {
            noApp: true,
          }),
        }

        if (isEmpty(detail) && isFederated) {
          Object.keys(formTemplate).forEach(key => {
            formTemplate[key] = FORM_TEMPLATES.federated({
              data: formTemplate[key],
              clusters: projectDetail.clusters.map(item => item.name),
              kind: key,
            })
          })
        }

        set(
          formTemplate,
          'Service.metadata.annotations["kubesphere.io/serviceType"]',
          type
        )

        this.workloadStore.setModule(module)

        if (isFederated) {
          steps.push({
            title: 'Diff Settings',
            icon: 'blue-green-deployment',
            component: withProps(ClusterDiffSettings, {
              withService: true,
            }),
          })
        }

        content = (
          <CreateModal
            width={960}
            module={module}
            store={this.workloadStore}
            name={t('Stateless Service')}
            description={t('STATELESS_SERVICE_DESC')}
            visible={visible}
            cluster={cluster}
            namespace={namespace}
            isFederated={isFederated}
            projectDetail={projectDetail}
            steps={steps}
            formTemplate={formTemplate}
            isSubmitting={isSubmitting}
            onOk={onOk}
            onCancel={onCancel}
            maskClosable={false}
            okBtnText={!isEmpty(detail) ? t('Update') : t('Add')}
          />
        )
        break
      }
      case 'statefulservice': {
        const module = 'statefulsets'
        const formTemplate = !isEmpty(detail)
          ? pick(detail, ['StatefulSet', 'Service'])
          : {
              StatefulSet: FORM_TEMPLATES.statefulsets({
                namespace,
              }),
              Service: FORM_TEMPLATES.services({ namespace }),
            }
        const steps = [...FORM_STEPS[type]]

        steps[0] = {
          ...steps[0],
          component: withProps(steps[0].component, {
            noApp: true,
          }),
        }

        if (isFederated) {
          Object.keys(formTemplate).forEach(key => {
            formTemplate[key] = FORM_TEMPLATES.federated({
              data: formTemplate[key],
              clusters: projectDetail.clusters.map(item => item.name),
              kind: key,
            })
          })
        }

        set(
          formTemplate,
          'Service.metadata.annotations["kubesphere.io/serviceType"]',
          type
        )

        this.workloadStore.setModule(module)

        if (isFederated) {
          steps.push({
            title: 'Diff Settings',
            icon: 'blue-green-deployment',
            component: withProps(ClusterDiffSettings, {
              withService: true,
            }),
          })
        }

        content = (
          <CreateModal
            width={960}
            module={module}
            store={this.workloadStore}
            name={t('Stateful Service')}
            description={t('STATEFUL_SERVICE_DESC')}
            visible={visible}
            cluster={cluster}
            namespace={namespace}
            isFederated={isFederated}
            projectDetail={projectDetail}
            steps={steps}
            formTemplate={formTemplate}
            isSubmitting={isSubmitting}
            onOk={onOk}
            onCancel={onCancel}
            okBtnText={!isEmpty(detail) ? t('Update') : t('Add')}
          />
        )
        break
      }
      default:
    }

    return content
  }

  render() {
    const { visible, onCancel, detail } = this.props
    let defaultS2iType = ''

    if (detail.S2iBuilder) {
      defaultS2iType = 's2i'
    }
    // if (detail.B2iBuilder) {
    //   defaultType = 'b2i'
    // }

    const { type, s2iType } = this.state
    if (type) {
      return this.renderSubModal(type, s2iType || defaultS2iType)
    }

    return (
      <Modal
        bodyClassName={styles.body}
        width={960}
        visible={visible}
        onCancel={onCancel}
        hideHeader
        // hideFooter
      >
        {this.renderHeader()}
        {this.renderGroups()}
      </Modal>
    )
  }
}
