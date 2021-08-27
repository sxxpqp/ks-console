import Base from 'stores/base'

const collectionDefaultSetting = {
  es: {
    logstashFormat: true,
    timeKey: '@timestamp',
    logstashPrefix: 'ks-logstash-log',
  },
}

const KS_LOG_NAMESPACE = 'kubesphere-logging-system'

const MATCHS = {
  logging: 'kube.*',
  events: 'kube_events',
  auditing: 'kube_auditing',
}

export default class outputStore extends Base {
  module = 'outputs'

  get apiVersion() {
    return 'apis/logging.kubesphere.io/v1alpha2'
  }

  getDetailUrl = ({ name, cluster }) =>
    `${this.getListUrl({ namespace: KS_LOG_NAMESPACE, cluster })}/${name}`

  fetch(params) {
    this.fetchListByK8s({
      namespace: KS_LOG_NAMESPACE,
      ...params,
    })
  }

  create({ Name, enabled = true, cluster, component, ...params }) {
    const createParams = {
      apiVersion: 'logging.kubesphere.io/v1alpha2',
      kind: 'Output',
      metadata: {
        name: `${Name}-${component}`,
        namespace: KS_LOG_NAMESPACE,
        labels: {
          'logging.kubesphere.io/enabled': `${enabled}`,
          'logging.kubesphere.io/component': component,
        },
      },
      spec: {
        match: MATCHS[component],
        [Name]: { ...collectionDefaultSetting[Name], ...params },
      },
    }
    return super.create(createParams, { cluster, namespace: KS_LOG_NAMESPACE })
  }
}
