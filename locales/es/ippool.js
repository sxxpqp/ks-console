module.exports = {
  'Pod IP Pool': 'Pod IP Pool',
  'Pod IP Pools': 'Pod IP Pools',

  'Create Pod IP Pool': 'Create Pod IP Pool',

  'IP/Mask Bit': 'IP/Mask Bit',
  'Used IP': 'Used IP',

  Mask: 'Mask',
  'Mask Bit': 'Mask Bit',
  Network: 'Network',

  'First Available': 'First Available',
  'Last Available': 'Last Available',
  'Available Number': 'Available Number',

  'Pod IP Range': 'Pod IP Range',

  'Number of Creation': 'Number of Creation',
  'Pod IP Pools to be created': 'Pod IP Pools to be created',
  'Set to be globally available': 'Set to be globally available',

  'Please input the IP address': 'Please input the IP address',
  'Please input the mask bit': 'Please input the mask bit',
  'Please input the IP/mask bit': 'Please input the IP/mask bit',

  'Please input the number of Pod IP Pools to be created':
    'Please input the number of Pod IP Pools to be created',

  POD_IP_POOL_DESC: 'Pod IP Pools of the cluster.',
  IP_POOL_CREATE_COUNT_DESC:
    'Up to 10 Pod IP Pools can be created at the same time.',
  IPPOOL_USAGE_Q: 'How to manage a Pod network using a Pod IP Pool?',
  IPPOOL_USAGE_A:
    'A Pod IP Pool is used to manage the Pod network address space, and the address space between each Pod IP Pool cannot overlap. When creating a workload, you can select a specific Pod IP Pool, so that created Pods will be assigned IPs from this Pod IP Pool.',

  IPPOOL_ASSIGN_WORKSPACE_DESC:
    'The Pod IP Pool can be used by a workspace after assigned to it.',
  IPPOOL_ASSIGN_WORKSPACE_ALLOCATED_WARNING:
    'The Pod IP Pool has been used and cannot be assigned to a specific workspace.',
  IPPOOL_ASSIGN_WORKSPACE_CHANGE_WARNING:
    'The Pod IP Pool has been used with a specific workspace assigned. The target workspace cannot be changed.',

  IPPOOL_WORKSPACE_EMPTY_TIP: 'No workspace is using this Pod IP Pool.',
}
