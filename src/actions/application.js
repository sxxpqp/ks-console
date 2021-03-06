import { get, set, isEmpty } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import { mergeLabels, updateFederatedAnnotations } from 'utils'
import FORM_TEMPLATES from 'utils/form.templates'
import { MODULE_KIND_MAP } from 'utils/constants'

import ROUTER_FORM_STEPS from 'configs/steps/ingresses'

import CreateModal from 'components/Modals/Create'
import DeployAppModal from 'projects/components/Modals/DeployApp'
import CreateAppModal from 'ai-platform/components/Modals/CreateApp'
import CreateAppServiceModal from 'projects/components/Modals/CreateAppService'
import ServiceMonitorModal from 'projects/components/Modals/ServiceMonitor'

import RouterStore from 'stores/router'
import ServiceMonitorStore from 'stores/monitoring/service.monitor'
import formPersist from 'utils/form.persist'
import CreateServiceModal from 'ai-platform/components/Modals/ServiceCreateFull'
import { updateAppList } from 'api/platform'

const customUpdateList = async props => {
  const { namespace, workspace, updateList } = props
  const res = await updateAppList({ namespace, workspace })
  const { code } = res
  if (code === 200) {
    Notify.success('创建成功')
    updateList && updateList()
  } else {
    Notify.error(`创建失败${res.message}`)
  }
}

export default {
  'app.update': {
    on({ namespace, workspace, ...props }) {
      Notify.success('创建中，创建成功后自动刷新列表，请等待')
      customUpdateList({ namespace, workspace, ...props })
    },
  },
  'app.deploy': {
    on({ store, ...props }) {
      const modal = Modal.open({
        onOk: async () => {
          Modal.close(modal)
        },
        modal: DeployAppModal,
        store,
        ...props,
      })
    },
  },
  'service.createfull': {
    on({ store, cluster, namespace, module, success, ...props }) {
      const kind = MODULE_KIND_MAP[module]
      const modal = Modal.open({
        onOk: newObject => {
          let data = newObject

          if (!data) {
            return
          }

          if (kind) {
            if (Object.keys(newObject).length === 1 && newObject[kind]) {
              data = newObject[kind]
            }
          }

          store.create(data, { cluster, namespace }).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}` })
            success && success()
            formPersist.delete(`${module}_create_form`)
          })
        },
        cluster,
        namespace,
        modal: CreateServiceModal,
        store,
        ...props,
      })
    },
  },
  'crd.app.create': {
    on({ store, cluster, namespace, workspace, success, appStore, ...props }) {
      debugger
      const modal = Modal.open({
        onOk: data => {
          store.create(data, { cluster, namespace }).then(async () => {
            // Notify.success('创建中，创建成功后自动刷新列表，请等待')
            // customUpdateList({ namespace, workspace, ...props })
            appStore.updateList({ namespace, workspace })
            Modal.close(modal)
            success && success()
          })
        },
        store,
        cluster,
        namespace,
        modal: CreateAppModal,
        ...props,
      })
    },
  },
  'crd.app.addservice': {
    on({ store, detail, cluster, namespace, success, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          const labels = detail.selector
          const serviceMeshEnable = String(detail.serviceMeshEnable)

          const component = {
            service: data.Service,
            workload: data.Deployment || data.StatefulSet,
          }

          mergeLabels(component.service, labels)
          mergeLabels(component.workload, labels)

          set(
            component.workload,
            'metadata.annotations["servicemesh.kubesphere.io/enabled"]',
            serviceMeshEnable
          )
          set(
            component.service,
            'metadata.annotations["servicemesh.kubesphere.io/enabled"]',
            serviceMeshEnable
          )

          set(
            component.workload,
            'spec.template.metadata.annotations["sidecar.istio.io/inject"]',
            serviceMeshEnable
          )

          if (props.isFederated) {
            updateFederatedAnnotations(component.workload)
            updateFederatedAnnotations(component.service)
            await store.create(component, { namespace })
          } else {
            await store.addComponent(component, {
              name: detail.name,
              cluster,
              namespace,
            })
          }

          Modal.close(modal)
          Notify.success({ content: `${t('Add Component Successfully')}` })
          success && success()
        },
        store,
        cluster,
        namespace,
        modal: CreateAppServiceModal,
        ...props,
      })
    },
  },
  'crd.app.addroute': {
    on({ store, detail, cluster, namespace, success, ...props }) {
      const routerStore = new RouterStore()
      const module = routerStore.module
      const kind = MODULE_KIND_MAP[module]
      const formTemplate = {
        [kind]: FORM_TEMPLATES[module]({
          namespace,
        }),
      }

      const modal = Modal.open({
        onOk: async data => {
          const labels = detail.selector
          const serviceMeshEnable = detail.serviceMeshEnable

          const _data = data.Ingress || data

          mergeLabels(_data, labels)

          if (serviceMeshEnable) {
            const template = props.isFederated
              ? get(_data, 'spec.template')
              : _data

            const serviceName = get(
              template,
              'spec.rules[0].http.paths[0].backend.serviceName'
            )
            if (serviceName) {
              set(
                template,
                'metadata.annotations["nginx.ingress.kubernetes.io/upstream-vhost"]',
                `${serviceName}.${namespace}.svc.cluster.local`
              )
            }
          }

          if (props.isFederated) {
            updateFederatedAnnotations(_data)
          }

          await routerStore.create(_data, { cluster, namespace })

          Modal.close(modal)
          Notify.success({ content: `${t('Add Route Successfully')}` })
          success && success()
        },
        cluster,
        namespace,
        formTemplate,
        module,
        store: routerStore,
        steps: ROUTER_FORM_STEPS,
        modal: CreateModal,
        okBtnText: t('Add'),
        selector: detail.selector,
        ...props,
        name: 'Route',
      })
    },
  },
  'app.service.monitor': {
    on({ store, cluster, namespace, success, ...props }) {
      const serviceMonitorStore = new ServiceMonitorStore()
      const formTemplate = FORM_TEMPLATES.servicemonitors({
        name: '',
        namespace,
      })
      const modal = Modal.open({
        onOk: async data => {
          const name = get(data, 'metadata.name')
          const result = await serviceMonitorStore.checkName({
            name,
            cluster,
            namespace,
          })

          if (!result.exist) {
            await serviceMonitorStore.create(data, { cluster, namespace })
          } else if (isEmpty(get(data, 'spec.endpoints'))) {
            await serviceMonitorStore.delete({ name, cluster, namespace })
          } else {
            await serviceMonitorStore.update({ name, cluster, namespace }, data)
          }

          Modal.close(modal)
          success && success()
        },
        cluster,
        namespace,
        formTemplate,
        app: store.detail,
        store: serviceMonitorStore,
        modal: ServiceMonitorModal,
        ...props,
      })
    },
  },
}
