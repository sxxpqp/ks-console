export const ROLE_MODULES = {
  globalroles: [
    {
      name: 'Clusters Management',
      icon: 'cluster',
    },
    {
      name: 'Access Control',
      icon: 'key',
    },
    {
      name: 'Apps Management',
      icon: 'openpitrix',
      hide: !globals.app.enableAppStore,
    },
    {
      name: 'Platform Settings',
      icon: 'cogwheel',
    },
  ],
  workspaceroles: [
    {
      name: 'Projects Management',
      icon: 'project',
    },
    {
      name: 'DevOps Management',
      icon: 'strategy-group',
      hide: !globals.app.hasKSModule('devops'),
    },
    {
      name: 'Apps Management',
      icon: 'appcenter',
      hide: !globals.app.hasKSModule('openpitrix'),
    },
    {
      name: 'Access Control',
      icon: 'key',
    },
    {
      name: 'Workspace Settings',
      icon: 'cogwheel',
    },
  ],
  roles: [
    {
      name: 'Application Workloads',
      icon: 'appcenter',
    },
    {
      name: 'Storage Management',
      icon: 'storage',
    },
    {
      name: 'Configuration Center',
      icon: 'hammer',
    },
    {
      name: 'Monitoring & Alerting',
      icon: 'monitor',
    },
    {
      name: 'Access Control',
      icon: 'human',
    },
    {
      name: 'Project Settings',
      icon: 'project',
    },
  ],
  devopsroles: [
    {
      name: 'Pipelines Management',
      icon: 'application',
    },
    {
      name: 'Credentials Management',
      icon: 'key',
    },
    {
      name: 'Access Control',
      icon: 'human',
    },
    {
      name: 'DevOps Settings',
      icon: 'strategy-group',
    },
  ],
  clusterroles: [
    {
      name: 'Cluster Resources Management',
      icon: 'nodes',
    },
    {
      name: 'Project Resources Management',
      icon: 'project',
    },
    {
      name: 'Network Management',
      icon: 'earth',
    },
    {
      name: 'Storage Management',
      icon: 'database',
    },
    {
      name: 'Monitoring & Alerting',
      icon: 'monitor',
    },
    {
      name: 'Access Control',
      icon: 'human',
    },
    {
      name: 'Cluster Settings',
      icon: 'cluster',
    },
  ],
}
