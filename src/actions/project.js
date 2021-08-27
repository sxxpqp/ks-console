import { get, set, omitBy, isEmpty } from 'lodash'
import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import QuotaEditModal from 'components/Modals/QuotaEdit'
import ProjectCreateModal from 'components/Modals/ProjectCreate'
import AssignWorkspaceModal from 'components/Modals/AssignWorkspace'
import DefaultResourceEditModal from 'projects/components/Modals/DefaultResourceEdit'
import GatewaySettingModal from 'projects/components/Modals/GatewaySetting'
import FORM_TEMPLATES from 'utils/form.templates'

import QuotaStore from 'stores/quota'
import UserStore from 'stores/user'

export default {
  'project.create': {
    on({ store, success, cluster, workspace, ...props }) {
      const modal = Modal.open({
        onOk: async data => {
          set(data, 'metadata.labels["kubesphere.io/workspace"]', workspace)
          const selectCluster = cluster || get(data, 'cluster')
          const params = {
            cluster: selectCluster,
            workspace,
          }
          await store.create(data, params)

          Modal.close(modal)
          Notify.success({ content: `${t('Created Successfully')}` })
          success && success(selectCluster)
        },
        hideCluster: !globals.app.isMultiCluster || !!cluster,
        cluster,
        workspace,
        formTemplate: FORM_TEMPLATES.project(),
        modal: ProjectCreateModal,
        store,
        ...props,
      })
    },
  },
  'project.quota.edit': {
    on({ store, detail, success, ...props }) {
      const quotaStore = new QuotaStore()
      const modal = Modal.open({
        onOk: async data => {
          const params = {
            name: data.name,
            namespace: detail.name,
            cluster: detail.cluster,
          }

          const spec = get(data, 'spec.hard', {})
          data.spec = {
            hard: omitBy(spec, v => (!v ? !v : isEmpty(v.toString()))),
          }
          const resp = await quotaStore.checkName(params)

          if (resp.exist) {
            await quotaStore.update(params, {
              apiVersion: 'v1',
              kind: 'ResourceQuota',
              metadata: { ...params, name: detail.name },
              spec: data.spec,
            })
          } else {
            await quotaStore.create(
              {
                apiVersion: 'v1',
                kind: 'ResourceQuota',
                metadata: { ...params, name: detail.name },
                spec: data.spec,
              },
              params
            )
          }

          Modal.close(modal)

          success && success()
        },
        detail,
        store: quotaStore,
        modal: QuotaEditModal,
        ...props,
      })
    },
  },
  'project.default.resource': {
    on({
      store,
      detail,
      namespace,
      cluster,
      success,
      isFederated,
      projectDetail,
      ...props
    }) {
      const modal = Modal.open({
        onOk: async data => {
          if (isEmpty(detail)) {
            let formTemplate = FORM_TEMPLATES.limitRange()

            if (isFederated) {
              formTemplate = FORM_TEMPLATES.federated({
                data: FORM_TEMPLATES.limitRange(),
                clusters: projectDetail.clusters.map(item => item.name),
                kind: 'LimitRange',
              })
              set(formTemplate, 'metadata.name', namespace)
              set(formTemplate, 'spec.template.spec', {
                limits: [{ ...data, type: 'Container' }],
              })
            } else {
              set(formTemplate, 'spec', {
                limits: [{ ...data, type: 'Container' }],
              })
            }

            await store.create(formTemplate, { namespace, cluster })
          } else {
            const formTemplate = {
              ...detail._originData,
            }

            if (isFederated) {
              set(formTemplate, 'spec.template.spec', {
                limits: [{ ...detail.limit, ...data }],
              })
            } else {
              set(formTemplate, 'spec', {
                limits: [{ ...detail.limit, ...data }],
              })
            }
            set(
              formTemplate,
              'metadata.resourceVersion',
              detail.resourceVersion
            )
            await store.update({ ...detail, namespace, cluster }, formTemplate)
          }

          Modal.close(modal)
          Notify.success({ content: `${t('Updated Successfully')}` })
          success && success()
        },
        modal: DefaultResourceEditModal,
        store,
        detail,
        ...props,
      })
    },
  },
  'project.assignworkspace': {
    on({ store, detail, success, ...props }) {
      const userStore = new UserStore()
      const modal = Modal.open({
        onOk: async data => {
          await store.patch(detail, data)

          const { cluster, name } = detail
          const username = get(
            data,
            'metadata.annotations["kubesphere.io/creator"]'
          )
          const workspace = get(
            data,
            'metadata.labels["kubesphere.io/workspace"]'
          )
          await userStore.create([{ username, roleRef: 'admin' }], {
            cluster,
            workspace,
            namespace: name,
          })

          Modal.close(modal)
          Notify.success({ content: `${t('Updated Successfully')}` })
          success && success()
        },
        modal: AssignWorkspaceModal,
        store,
        ...props,
      })
    },
  },
  'project.gateway.edit': {
    on({ store, detail, cluster, namespace, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          store.addGateway({ cluster, namespace }, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Updated Successfully')}` })
            success && success()
          })
        },
        modal: GatewaySettingModal,
        store,
        detail,
        cluster,
        ...props,
      })
    },
  },
}
