module.exports = {
  'Add Cluster': '添加集群',
  'Add New Cluster': '添加新集群',
  'Import Kubernetes Cluster': '导入 Kubernetes 集群',
  Import: '导入',

  Validating: '校验中',
  'Validation failed': '校验失败',

  'Cluster Name': '集群名称',
  'Cluster Management': '集群管理',
  'Nodes Management': '节点管理',
  'Node Types': '节点类型',
  'Network Management': '网络管理',
  'Custom Resources': '自定义资源 CRD',
  'Storage Management': '存储管理',
  'Cluster Settings': '集群设置',
  Snapshots: '存储卷快照',
  'Network Policies': '网络策略',
  'Network Topology': '网络拓扑',
  'Cluster Visibility': '集群可见性',
  'Cluster Members': '集群成员',
  'Cluster Roles': '集群角色',
  'Kubernetes Settings': 'Kubernetes 设置',
  'Connection Method': '连接方式',

  'Host Cluster': 'Host 集群',
  'Host Clusters': 'Host 集群',
  'Member Cluster': 'Member 集群',
  'Member Clusters': 'Member 集群',

  'Kubernetes Version': 'Kubernetes 版本',
  'KubeSphere Version': 'KubeSphere 版本',

  'Edit Cluster Info': '编辑集群信息',

  'Cluster List': '集群列表',
  'Cluster Info': '集群信息',
  'Kubernetes Status': 'Kubernetes 组件状态',
  Tools: '工具',

  'Edit Visibility': '编辑可见范围',

  'Go back': '返回上一步',

  Provider: '服务商',

  'Choose a provider': '选择服务商',

  'User Projects': '用户项目',
  'System Projects': '系统项目',

  'Waiting for the cluster to join': '等待集群加入',

  'Click to Copy': '点击复制',

  'Cluster initialization failed': '集群初始化失败',

  'Not Ready': '未就绪',

  'Copy successfully': '复制成功',

  Unbind: '解除绑定',

  'Unbind Cluster': '解绑集群',

  'Cluster Member': '集群成员',

  Authorized: '已授权',
  Unauthorized: '待授权',

  'Please input cluster name': '请输入集群名称',

  'Authorize the cluster to workspace': '集群授权企业空间',
  'Set as public cluster': '设置为公开集群',

  'The current cluster is public': '当前集群处于公开状态',

  'Available Clusters': '可用集群',
  'Select Clusters': '集群选择',
  'Edit cluster basic information': '编辑集群基础信息',

  'Scheduler Scheduling Times': '调度器调度次数',
  'Scheduling Failed Pods': '调度失败的容器组',

  'Please select or input a tag': '请选择或输入标识',
  'Please select or input a provider': '请选择或输入服务商',
  'Please input the kubesphere api server address of the cluster':
    '请输入待加入集群的 Kubesphere API Server 地址',

  'All Projects': '全部项目',

  'Enter the project': '进入项目',

  'How to Add': '添加方式',

  'New Cluster': '新建集群',

  'Import Cluster': '导入集群',

  'Cluster Basic Info': '集群基本信息',

  'Node Settings': '节点设置',

  'Please add at least one cluster node': '请至少添加一个集群节点',
  "Please specify the node's roles": '请指定节点的角色',
  'Please input the IP address': '请输入 IP 地址',

  'Add node to the cluster': '添加节点到集群中',

  'Node Internal IP Address': '节点内网 IP 地址',
  'SSH Port': 'SSH 端口',
  'SSH IP Address': 'SSH IP 地址',
  'Username & Password': '用户名密码',
  'SSH Secret': 'SSH 密钥',
  'SSH Authentication Mode': 'SSH 鉴权方式',
  'Kubernetes Cluster Settings': 'Kubernetes 集群配置',
  'Network Plugin': '网络插件',
  'Max Pods': '节点最大容器组数量',
  'Pods CIDR': '容器组 CIDR',
  'Service CIDR': '服务 CIDR',
  'Default Storage Plugin': '默认存储插件',
  'Private Registry Configuration': '私有仓库配置',
  'etcd Backup': 'etcd 备份',

  'etcd Backup Dir': 'etcd 备份地址',
  'etcd Backup Period': 'etcd 备份地址',
  'Keep Backup Number': '保留的备份数',

  'KubeSphere Settings': 'KubeSphere 设置',

  'Invalid IP address': 'IP 地址不合法',

  'Cluster Creation Progress': '集群创建进度',

  'Current Progress': '当前进度',

  'Log Info': '日志信息',

  NO_CLUSTER_TIP: '请添加至少 1 个集群',
  NO_CLUSTER_TIP_DESC:
    '集群是一组运行着 Kubernetes 的节点 (物理或者虚拟机)，Kubesphere 的功能也依托于集群中的节点来运行',
  ADD_NEW_CLUSTER_DESC: '添加新的 Kubernetes 集群',
  CHOOSE_PROVIDER_DESC:
    'KubeSphere 提供了在主流服务商中快速部署 Kubernetes 集群的方案',

  VISIBILITY_PART: '部分可见',
  VISIBILITY_PUBLIC: '公开',

  MULTI_CLUSTER: '多集群',

  CLUSTER_SETTINGS_DESC: '定义集群配置信息',
  CLUSTER_TAG: '标识',
  CLUSTER_TAG_DESC: '标识此集群的用途，例如 生产环境、测试环境、演示环境 等',
  CLUSTER_PROVIDER_DESC: '提供集群基础设施的厂商',
  CLUSTER_CONNECT_METHOD_DESC: '可以直接连接集群或者使用代理',

  CONNTECT_DIRECT: '直接连接 Kubernetes 集群',
  CONNTECT_PROXY: '集群连接代理',

  CLUSTER_WAITING_JOIN_DESC:
    '暂时没有可用的节点，集群为不可以用状态，您可以添加以下配置文件以启用该集群',

  CLUSTER_AGENT_TIP_1:
    '请在通过SSH在目标集群中创建一个名称为 agent.yaml 的文件',
  CLUSTER_AGENT_TIP_1_DESC: '例如 <span class="code">vi agent.yaml</span>',
  CLUSTER_AGENT_TIP_2: '复制以下配置文件至 agent.yaml 中',
  CLUSTER_AGENT_TIP_2_DESC: '该代理文件可以将目标集群与平台进行连接',
  CLUSTER_AGENT_TIP_3:
    '通过命令行执行 <span class="code">kubectl create -f agent.yaml</span>',
  CLUSTER_AGENT_TIP_3_DESC: '执行命令之后等待集群状态的更新',

  CLUSTER_CONDITIONS: '集群状态',
  CLUSTER_BASE_INFO_DESC: '当前集群基础信息总览',

  UNBIND_CLUSTER_DESC:
    '解绑集群后，KubeSphere 将无法再对该集群进行管理。 解绑后，该集群内的 Kubernetes 资源不会被删除。',
  SURE_TO_UNBIND_CLUSTER: '我确定要执行解绑集群的操作',

  'Invite members to the cluster': '邀请成员到该集群',
  INVITE_CLUSTER_MEMBER_DESC: '您可以邀请新的成员来此集群',

  AUTHORIZE_CLUSTER_TO_WORKSPACE_DESC:
    '集群授权可以将集群通过授权的形式指定给企业空间使用该集群',

  PUBLIC_CLUSTER_DESC:
    '公开状态的集群意味着平台内的用户都可以使用该集群，并在集群中创建和调度资源',

  CLUSTER_AUTHORIZATION_DESC:
    '集群授权可以将集群通过授权的形式指定给企业空间使用该集群',

  CLUSTER_VISIBILITY_Q1: '如何将集群授权给指定的企业空间使用？',
  CLUSTER_VISIBILITY_A1:
    '集群可以通过“编辑可见范围”将集群授权给不同的企业空间使用',
  CLUSTER_VISIBILITY_Q2: '什么是公开集群?',
  CLUSTER_VISIBILITY_A2:
    '公开状态的集群意味着平台内的用户都可以使用该集群，并在集群中创建和调度资源',

  SELECT_CLUSTERS_DESC: '选择企业空间下可用的集群',

  CLUSTER_API_SERVER_TITLE: '待加入集群的 Kubesphere API Server',
  CLUSTER_API_SERVER_DESC: '需要添加待加入集群的 KubeSphere API Server 地址',

  INPUT_KUBECONFIG: '请填写目标集群的 KubeConfig',

  CLUSTER_DIRECT_IMPORT_TIP:
    'KubeSphere 多集群控制平面通过提供的 kubeconfig 来直接连接导入集群，此种方式要求当前集群能够通过 kubeconfig 中的 server 地址直接访问待导入集群。 </br></br>通常适用于:</br>1. 当前集群和待导入集群在同一内网网络中</br>2. 当前集群和待导入集群已通过 VPN 或隧道等其它技术连通所在网络</br>3. kubeconfig 的 server 地址可以通过公网访问',
  CLUSTER_AGENT_IMPORT_TIP:
    'KubeSphere 控制平面通过代理方式连接待导入集群，控制平面启动一个公开的代理服务，待导入集群创建相应的客户端组件连接代理服务，与控制平面之间建立一个反向代理。此种方式不需要待导入集群和控制平面在同一网络，也不要求待导入集群暴露集群的 apiserver 地址，但会有一定的网络性能损耗。</br></br>通常适用于:</br>1. 当前集群和待导入集群不在同一网络中<br/>2. 当前集群和待导入集群无法通过 VPN 或隧道等其它技术连通所在网络<br/>3. 对集群间网络性能损耗能容忍',

  HOW_TO_GET_KUBECONFIG: '如何获取 KubeConfig?',

  CLUSTER_AGENT_TITLE: '请根据集群中提供的代理连接设置加入集群',
  CLUSTER_AGENT_DESC: '需要在集群中设置下相应的代理 Agent',

  SELECT_HOST_CLUSTER_WARNING:
    '请尽量不要在 Host 集群上创建资源，以免 Host 集群负载过高，导致多集群稳定性下降。',
  HOST_CLUSTER_VISIBILITY_WARNING:
    '请谨慎将 Host 集群授权给企业空间，Host 集群负载过高会导致多集群稳定性下降。',
  CLUSTER_VISIBILITY_REMOVE_WARNING:
    '移除集群对企业空间的授权，将删除该企业空间在当前集群下的所有资源。',

  REMOVE_WORKSPACE_CONFIRM_TITLE: '确定移除授权？',
  REMOVE_WORKSPACE_CONFIRM_DESC:
    '确定移除对企业空间 {resource} 的授权？移除集群对企业空间的授权，将删除该企业空间在当前集群下的所有资源！',

  SELECT_ADD_CLUSTER_METHOD: '选择添加集群的方式',
  SELECT_ADD_CLUSTER_METHOD_DESC: '支持添加新集群和导入已存在集群',

  NEW_CLUSTER_DESC: '添加新的 Kubernetes 集群',
  IMPORT_CLUSTER_DESC: '导入已有的 Kubernetes 集群',
  CLUSTER_NODE_SETTINGS_DESC: '添加集群需要的节点',
  CLUSTER_NODE_INTERNAL_IP_DESC: '集群内各节点间可以互相访问的内网 IP 地址',
  NODE_ROLE_DESC:
    '集群角色中，master 节点数量需要为 1 或 3，woker 节点数量至少为 1',
  SSH_IP_ADDRESS_DESC: 'SSH IP 地址请填入当前 Host 集群可以访问到的 IP 地址',
  SSH_AUTH_MODE_DESC: '支持用户名密码以及 SSH 密钥',
  SSH_ACCOUNT_DESC: '默认以 root 用户登录',
  SSH_PASSWORD_DESC: '登录节点时需要的密码',
  SSH_SECRET_PLACEHOLDER: 'Ctrl + v 将密钥粘贴于此',

  K8S_CLUSTER_SETTINGS_DESC: '对即将新建的 Kubernetes 集群进行初始化配置',

  CLUSTER_MAX_PODS_DESC: '可以在此 Kubelet 上运行的 pod 的数量. 默认为 110.',

  K8S_NETWORK_PLUGIN_CALICO:
    'Calico 是一个纯3层的网络方案，无缝集成 IaaS 云架构，能够提供的 VM、容器、裸机之间的IP通信',
  K8S_NETWORK_PLUGIN_FLANNEL:
    'Flannel 可以让集群中的不同节点主机创建的 Docker 容器都具有全集群唯一的虚拟IP地址',
  K8S_NETWORK_PLUGIN_CILIUM: '基于 eBPF 的网络，具有安全性和可观察性',

  KUBE_PODS_CIDR_DESC:
    '在节点上运行的 Pod 从节点的 Pod CIDR 范围分配 IP 地址。',
  KUBE_SERVICE_CIDR_DESC: '分配给服务的 IP 池',

  CLUSTER_COMPONENTS_DESC: '对集群的服务组件进行定制',

  CLUSTER_ADVANCED_SETTINGS_DESC: '可以根据需要配置您所需要的服务',
  CLUSTER_PRIVATE_REGISTRY_DESC:
    '给集群配置私有镜像仓库，当开始构建集群时会通过此镜像仓库拉取所需的全部镜像。',

  CLUSTER_CONTROLPLANE_ENDPOINT: '授权集群访问地址',
  CLUSTER_CONTROLPLANE_ENDPOINT_DESC:
    '通过授权的集群访问地址与集群直接通信，为集群生成 kubeconfig 来访问集群。',
  CLUSTER_ETCD_BACKUP_DESC: '对 etcd 进行定期备份设置',
  CLUSTER_ETCD_BACKUP_DIR_DESC: '在 etcd 主机上存储 etcd 备份文件的位置。',
  CLUSTER_ETCD_BACKUP_PERIOD_DESC: '运行 etcd 备份任务的时间，单位为分钟。',
  CLUSTER_ETCD_BACKUP_NUMBER_DESC: '要保留多少个备份副本。',
  CLUSTER_KUBESPHERE_SETTINGS_DESC: '针对 KubeSphere 的一些定制化设置',

  CLUSTER_CREATING: '集群正在创建中',
  CLUSTER_CREATING_TIP:
    '当前集群正在创建，暂时没有可用的节点，所以集群为不可以用状态',

  CLUSTER_INIT_NODES: '初始化节点',
  CLUSTER_PULL_IMAGES: '拉取镜像',
  CLUSTER_INIT_ETCD_CLUSTER: '初始化 etcd 集群',
  CLUSTER_INIT_CONTROL_PLANE: '初始化控制平面',
  CLUSTER_JOIN_NODES: '添加节点',
  CLUSTER_INSTALL_ADDONS: '安装插件',
  FETCHING_LOGS: `正在获取日志...`,

  MASTER_NODE_COUNT_TIP: 'Master 节点数量需要为 1 或 3',
  WORKER_NODE_COUNT_TIP: 'Worker 节点数量至少为 1',

  CLUSTER_CREATION_PROGRESS_TIP:
    '根据所创建的集群规模和网络连接的不同，创建完成整个集群大概需要 30 ~ 60 分钟。',

  CLUSTER_UPGRADE_REQUIRED:
    '当前集群版本无法使用此功能，请升级到 {version} 或以上版本。',
  MEMBER_CLUSTER_UPGRADE_TIP:
    '低于 {version} 版本 member 集群无法使用此功能, 请将 member 集群升级到 {version} 或以上版本。',
}
