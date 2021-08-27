export const IMPORT_CLUSTER_SPEC = {
  apiVersion: 'cluster.kubesphere.io/v1alpha1',
  kind: 'Cluster',
  spec: {
    provider: '',
    connection: {
      type: 'direct',
      kubeconfig: '',
    },
    joinFederation: true,
  },
}

export const NEW_CLUSTER_SPEC = {
  apiVersion: 'kubekey.kubesphere.io/v1alpha1',
  kind: 'Cluster',
  metadata: {},
  spec: {
    hosts: [],
    roleGroups: {},
    controlPlaneEndpoint: {
      domain: 'lb.kubesphere.local',
      address: '',
      port: 6443,
    },
    kubernetes: {
      clusterName: 'cluster.local',
      maxPods: 110,
      etcdBackupDir: '/var/backups/kube_etcd',
      etcdBackupPeriod: 30,
      keepBackupNumber: 5,
    },
    network: {
      plugin: 'calico',
      kubePodsCIDR: '10.233.64.0/18',
      kubeServiceCIDR: '10.233.0.0/18',
      ipipMode: 'Always',
      vxlanMode: 'Never',
      vethMTU: 1440,
    },
    registry: {
      privateRegistry: '',
    },
    addons: [{}, {}],
  },
}

export const NETWORK_PLUGIN_ICONS = {
  calico: '',
  flannel: '',
  cilium: '',
}

export const STORAGE_PLUGIN_ICONS = {
  nfs: 'vsan',
}
