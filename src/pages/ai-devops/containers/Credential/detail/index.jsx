import React from 'react'
import { observer, inject } from 'mobx-react'

import CredentialStore from 'stores/devops/credential'
import Status from 'devops/components/Status'
import DetailPage from 'devops/containers/Base/Detail'
import { trigger } from 'utils/action'
import { get } from 'lodash'
import routes from './routes'

@inject('rootStore', 'devopsStore')
@observer
@trigger
export default class CredentialDetail extends React.Component {
  state = {
    showEdit: false,
    showYamlEdit: false,
    deleteModule: false,
    isLoading: true,
  }

  refreshTimer = setInterval(() => this.refreshHandler(), 4000)

  get module() {
    return 'credentials'
  }

  get listUrl() {
    const { workspace, devops, cluster } = this.props.match.params
    return `/${workspace}/clusters/${cluster}/devops/${devops}/credentials`
  }

  get devops() {
    return this.props.match.params.devops
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get isRuning() {
    const { detail } = this.store

    const status = get(
      detail,
      'annotations["credential.devops.kubesphere.io/syncstatus"]'
    )

    return status === 'pending' || status === 'working'
  }

  store = new CredentialStore(this.module)

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate() {
    if (this.refreshTimer === null && this.isRuning) {
      this.refreshTimer = setInterval(() => this.refreshHandler(), 4000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer)
  }

  refreshHandler = () => {
    if (this.isRuning) {
      this.store.fetchDetail()
    } else {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  fetchData = () => {
    const { params } = this.props.match
    this.store.setParams(params)
    this.store.fetchDetail()
    this.store.getUsageDetail()
  }

  getOperations = () => [
    {
      key: 'edit',
      type: 'control',
      text: t('EDIT'),
      action: 'edit',
      onClick: () => {
        this.trigger('devops.credential.edit', {
          title: t('Edit Credential'),
          formTemplate: this.store.detail,
          cluster: this.cluster,
          devops: this.devops,
          isEditMode: true,
          success: () => {
            this.store.fetchDetail()
          },
        })
      },
    },
    {
      key: 'delete',
      type: 'danger',
      text: t('Delete'),
      action: 'delete',
      onClick: () => {
        this.trigger('resource.delete', {
          type: t('Credentials'),
          detail: this.store.detail,
          success: () => {
            const { devops, workspace, cluster } = this.props.match.params
            this.routing.push(
              `/${workspace}/clusters/${cluster}/devops/${devops}/${this.module}`
            )
          },
        })
      },
    },
  ]

  getPipelineStatus = status => {
    const CONFIG = {
      failed: { type: 'failure', label: t('Failure') },
      pending: { type: 'running', label: t('Running') },
      working: { type: 'running', label: t('Running') },
      successful: { type: 'success', label: t('Success') },
    }

    return { ...CONFIG[status] }
  }

  getAttrs = () => {
    const { detail, usage } = this.store
    const status = get(
      detail,
      'annotations["credential.devops.kubesphere.io/syncstatus"]'
    )

    return [
      {
        name: t('Type'),
        value: t(detail.type),
      },
      {
        name: t('Description'),
        value: detail.description,
      },
      {
        name: t('Domain'),
        value: usage.domain,
      },
      {
        name: t('Sync Status'),
        value: <Status {...this.getPipelineStatus(status)} />,
      },
    ]
  }

  render() {
    const { detail } = this.store
    const stores = { detailStore: this.store }
    const { devops, cluster, workspace } = this.props.match.params
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 187 ~ CredentialDetail ~ render ~ this.props.match.params',
    //   this.props.match.params
    // )

    const sideProps = {
      module: this.module,
      name: detail.id,
      labels: detail.labels,
      desc: detail.description,
      operations: this.getOperations(),
      attrs: this.getAttrs(),
      breadcrumbs: [
        {
          label: t('Credentials'),
          url: `/${workspace}/clusters/${cluster}/devops/${devops}/credentials`,
          // url: this.listUrl,
        },
      ],
    }

    return <DetailPage routes={routes} {...sideProps} stores={stores} />
  }
}
