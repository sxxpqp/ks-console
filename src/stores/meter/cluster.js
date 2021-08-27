import { action, observable } from 'mobx'
import { isArray, isEmpty, isUndefined } from 'lodash'

import ClusterStore from 'stores/cluster'
import NodeStore from 'stores/node'
import WorkspaceStore from 'stores/workspace'
import NamespaceStore from 'stores/project'
import ApplicationCrdStore from 'stores/application/crd'
import OPStore from 'stores/openpitrix/application'
import ServiceStore from 'stores/service'
import WorkloadStore from 'stores/workload'
import PodStore from 'stores/pod'

import { ICON_TYPES, CLUSTER_PROVIDER_ICON } from 'utils/constants'

import {
  filterResourceLevel,
  hasNameSpacesType,
  filterListByType,
  getFetchParams,
  getListConfig,
} from 'utils/meter'

import Base from './base'

export default class ClusterMeter extends Base {
  @observable
  list = []

  @observable
  clustersConfig = {}

  @observable
  cacheList = []

  @observable
  levelMeterData = {}

  @observable
  cacheLevelData = {}

  @observable
  isLoading = false

  clusterStore = new ClusterStore()

  nodeStore = new NodeStore()

  workspaceStore = new WorkspaceStore()

  namespaceStore = new NamespaceStore()

  applicationCrdStore = new ApplicationCrdStore()

  serviceStore = new ServiceStore()

  deploymetStore = new WorkloadStore('deployments')

  statefulsetStore = new WorkloadStore('statefulsets')

  daemonsetStore = new WorkloadStore('daemonsets')

  opStore = new OPStore()

  podStore = new PodStore()

  getPath({
    cluster,
    namespaces,
    workspaces,
    deployments,
    statefulsets,
    daemonsets,
    services,
    pods,
  } = {}) {
    let path = ''

    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespaces) {
      path += `/namespaces/${namespaces}`
    }
    if (workspaces) {
      path += `/workspaces/${workspaces}`
    }
    if (services) {
      path += `/services/${services}`
    }
    if (deployments) {
      path += `/deployments/${deployments}`
    }
    if (statefulsets) {
      path += `/statefulsets/${statefulsets}`
    }

    if (daemonsets) {
      path += `/daemonsets/${daemonsets}`
    }

    if (pods) {
      path += `/pods/${pods}`
    }

    return path
  }

  handleNameByType = (type, item) => {
    return type === 'applications'
      ? `${item.name}:${item.selector['app.kubernetes.io/version']}`
      : type === 'openpitrixs'
      ? item.cluster_id
      : item.name
  }

  handleIconByType = (type, provider) => {
    return type === 'cluster' && provider
      ? CLUSTER_PROVIDER_ICON[provider] || 'kubernetes'
      : ICON_TYPES[type]
  }

  handleStatusByWorkload = (status, type, item) => {
    return status
      ? type === 'deployments' || type === 'statefulsets'
        ? status({
            hasS2i: item.hasS2i,
            spec: item.spec,
            status: item.status,
            annotations: item.annotations,
          })
        : status(item)
      : undefined
  }

  store = {
    cluster: this.clusterStore,
    nodes: this.nodeStore,
    workspaces: this.workspaceStore,
    namespaces: this.namespaceStore,
    applications: this.applicationCrdStore,
    services: this.serviceStore,
    deployments: this.deploymetStore,
    statefulsets: this.statefulsetStore,
    daemonsets: this.daemonsetStore,
    openpitrixs: this.opStore,
    pods: this.podStore,
  }

  get isMultiCluster() {
    return !globals.app.isMultiCluster
  }

  getStore = type => {
    return this.store[type]
  }

  @action
  fetchList = async ({ type, ...rest }) => {
    const store = this.getStore(type)
    const params = getFetchParams({
      isMultiCluster: this.isMultiCluster,
      type,
      ...rest,
    })

    const listConfig = getListConfig({
      isMultiCluster: this.isMultiCluster,
      type,
    })

    const requestList = []

    params.forEach(request => {
      if (Object.prototype.toString.call(store) === '[object Array]') {
        store.forEach(_store => {
          requestList.push(_store.fetchList({ ...request }))
        })
      } else {
        requestList.push(store.fetchList({ ...request }))
      }
    })

    const repList = await Promise.all(requestList).catch(() => {
      return []
    })

    let data = []

    if (!isEmpty(repList) && isArray(repList)) {
      repList.forEach((rep, index) => {
        rep.forEach(item => {
          if (
            !hasNameSpacesType(type) ||
            (hasNameSpacesType(type) &&
              filterListByType({ type, ...rest })(item))
          ) {
            const { status, desc } = listConfig[index]
            const _status = this.handleStatusByWorkload(status, type, item)
            const name = this.handleNameByType(type, item)
            const icon = this.handleIconByType(type, item.provider)

            data.push({
              icon,
              name,
              status: _status,
              desc: t(desc),
              labelSelector: item.selector,
              type,
              _origin: { ...item },
            })
          }
        })
      })
    }

    if (type === 'pods') {
      data = data.filter(
        item => item.status !== 'Completed' && item.status !== 'Error'
      )
    }

    if (rest.node) {
      this.list = data
      return data
    }

    const result = await filterResourceLevel({
      levelMeterData: this.levelMeterData,
      type,
      data,
      ...rest,
    })

    this.list = result
    return result
  }

  @action
  fetchLevelMeter = async ({ cluster, namespaces, workspaces }) => {
    if (cluster) {
      this.cluster = cluster
    }

    const url = `${this.tenantUrl({
      cluster,
    })}/namespaces/${namespaces}/metering/hierarchy${
      workspaces ? `?workspace=${workspaces}` : ''
    }`

    const result = await request.get(url, {}, {}, () => {
      return {}
    })
    const data =
      !isUndefined(result) && !isEmpty(result) ? { [namespaces]: result } : {}

    this.levelMeterData = data
    return data
  }

  @action
  setLevelMeterData = levelMeterData => {
    this.levelMeterData = levelMeterData
  }
}
