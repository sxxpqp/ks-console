import { get, cloneDeep, unset } from 'lodash'

const getNamespaceTemplate = data => {
  const name = get(data, 'metadata.name')
  const annotations = get(data, 'metadata.annotations')
  const placement = get(data, 'spec.placement')
  const clusters = get(data, 'spec.placement.clusters', [])

  const workspace = get(data, 'metadata.labels["kubesphere.io/workspace"]')

  const template = cloneDeep(data)
  unset(template, 'apiVersion')
  unset(template, 'kind')
  unset(template, 'metadata.name')
  unset(template, 'metadata.annotations')
  unset(template, 'spec')

  const overrides = clusters.map(cluster => ({
    clusterName: cluster.name,
    clusterOverrides: [{ path: '/metadata/annotations', value: annotations }],
  }))

  return {
    apiVersion: 'types.kubefed.io/v1beta1',
    kind: 'FederatedNamespace',
    metadata: {
      name,
      namespace: name,
      labels: {
        'kubesphere.io/workspace': workspace,
      },
      annotations,
    },
    spec: { placement, template, overrides },
  }
}

export default {
  namespaces: getNamespaceTemplate,
}
