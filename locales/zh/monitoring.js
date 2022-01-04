module.exports = {
  Monitoring: '监控',
  'Monitoring Center': '监控中心',
  'Physical Resources': '物理资源',
  'Physical Resources Monitoring': '物理资源监控',
  'Service Component Monitoring': '服务组件监控',
  'Application Resources': '应用资源',
  'Application Resources Monitoring': '应用资源监控',

  'Node Count': '节点数量',
  'Cluster Status': '集群状态',
  'Cluster Status Monitoring': '集群状态监控',
  'Cluster Monitors': '集群监控',
  'Cluster Resource Monitoring': '集群资源监控',
  'ETCD Monitoring': 'ETCD监控',
  'ETCD Service Status': 'ETCD服务状态',
  'ETCD Nodes': 'ETCD节点',
  'External ETCD': '外部ETCD',
  'APIServer Monitoring': 'APIServer监控',
  'Scheduler Monitoring': '调度器监控',
  'Historical Monitoring': '历史监控',
  'Node Usage Ranking': '节点用量排行',
  'Usage Ranking': '用量排行',
  'Resources Usage': '资源用量',
  'Resources Usage Trend': '资源用量趋势',
  'Physical Resources Usage': '物理资源用量',
  'Application Resources Usage': '应用资源用量',
  'Projects Change Trend': '项目变化趋势',
  'Projects Count': '项目数量',
  'Cluster Resources Usage': '集群资源使用情况',
  'Cluster Node Status': '集群节点状态',
  'Component Status': '组件状态',
  'Running Status': '运行状态',
  'Disk Usage': '磁盘使用量',
  'Disk Capacity': '磁盘容量',
  'inode Utilization': 'inode 使用率',
  'Running Pods': '运行中的容器组',
  'Abnormal Pods': '异常容器组',

  'Controller Manager': '管理控制中心',
  'K8s Scheduler': 'K8s 调度器',
  Scheduler: '调度器',
  Node: '节点',

  'Select Time Range': '选择时间范围',
  'Custom Time Range': '自定义时间范围',
  'Only Show Selected': '仅显示已选',
  'View All Replicas': '查看全部副本',
  'View All': '查看全部',
  'View More': '查看更多',

  Interval: '间隔',
  Last: '最近',
  TIME_S: '{num} 秒',
  TIME_M: '{num} 分钟',
  TIME_H: '{num} 小时',
  TIME_D: '{num} 天',
  UTILIZATION: '使用率',
  RESOURCE_USAGE_TITLE: '资源使用情况',
  MONITORING_CLUSTER_DESC: '监控集群的运行状态。',
  MONITORING_PHYSICAL_DESC: '监控集群物理资源的运行状态',
  MONITORING_APPLICATION_DESC: '监控集群应用资源的运行状态。',
  TIMERANGE_SELECTOR_MSG: '结束时间需晚于开始时间',
  MONITORING_SELECT_LIMIT_MSG: '最多可以选择 10 个资源',

  second: '秒',
  ms: '毫秒',
  times: '次',
  'times/s': '次/秒',
  'Raft Proposals': 'Raft 提议',
  'Proposal Commit Rate': '提议提交速率',
  'Proposal Apply Rate': '提议应用速率',
  'Proposal Failure Rate': '提议失败速率',
  'Proposal Pending Total': '排队提议数',
  'DB Size': '库大小',
  'Client Traffic': '客户端流量',
  Received: '接收',
  Sent: '发送',
  'gRPC Stream Messages': 'gRPC 流式消息',
  'WAL Fsync': 'WAL 日志同步时间',
  'DB Fsync': '库同步时间',
  'Request Latency': '请求延迟',
  'Total Average': '总均值',
  'APIs Average': 'APIs 均值',
  'Request Per Second': '每秒请求数',
  Request: '请求',
  'Attempt Frequency': '调度次数',
  'Attempt Rate': '调度速率',
  'Scheduling Latency': '调度延迟',

  AVERAGE: '平均值',
  TOTAL_AVERAGE: '总均值',
  SCHEDULED_SUCCESS: '成功',
  SCHEDULED_ERROR: '错误',
  SCHEDULED_FAIL: '失败',
  ETCD_NODE_TITLE: 'ETCD节点',
  ETCD_LEADER_TITLE: '是否有Leader',
  ETCD_CHANGES_TITLE: 'Leader变更次数 (1小时内)',
  ETCD_STATUS: '服务 <span>状态</span>',
  ETCD_PROPOSAL: 'Raft <span>提议</span>',
  ETCD_DB_SIZE: '库 <span>大小</span>',
  ETCD_CLIENT_TRAFFIC: '客户端 <span>流量</span>',
  REQUEST_LATENCY: '请求 <span>延迟</span>',
  REQUEST_RATE: '请求 <span>速率</span>',
  ATTEMPT_FREQUENCY: '调度 <span>次数</span>',
  ATTEMPT_RATE: '调度 <span>速率</span>',
  PROPOSAL_COMMITTED: '提议提交速率',
  PROPOSAL_APPLIED: '提议应用速率',
  PROPOSAL_FAILED: '提议失败速率',
  PROPOSAL_PENDING: '排队提议数',

  EDIT_TEMPLATE: '编辑模板',
  SAVE_TEMPLATE: '保存模板',

  'No Refreshing': '不刷新',

  GRAPH_COLORS: '图表配色',
  SINGLE_GRAPH_TYPE: '最常见的图表类型',
  SINGLE_GRAPH_TYPE_NAME: '基础图',
  STACKED_GRAPH_TYPE: '堆叠图',
  STACKED_GRAPH_TYPE_DESC: '适用于各大类总量及分量之间的对比显示',
  CHART_TYPES: '图表类型',
  GRAPH_TYPES: '图例类型',
  ADD_MONITOR_ITEM: '添加监控项',
  ADD_MONITOR_ROW: '添加监控组',
  MONITOR_TYPE_NO_SUPPORT: '当前不支持该类型',
  TABLE_SETTINGS: '表格设置',
  PER_PAGE_LINES: '每页行数',
  CUSTOM_DISPLAY_STYLE: '设置显示格式',
  CUSTOM_DISPLAY_MODAL_DESC: '根据需要定制Table中的显示格式',
  DATA_TYPE: '数据类型',
  DECIMALS: '精确位',
  THRESHOLD_FILL: '阈值填充',
  THRESHOLD_FILL_DESC: '可以设置阈值，数值超出后可以自动更改样式提示',
  HIGHT_RULES: '高亮规则',
  TIME_FORMAT: '时间格式',
  MONITOR_METRICS: '监控指标',
  DEBUGB_DATA: '调试数据',
  LINE_CHART: '折线图',
  BAR_CHART: '柱状图',
  SINGLE_STATE_CHART: '即时文本',
  APPLICABLE_SCENE: '适用场景',
  BASE_LINE_CHART: '基础折线图',
  STACK_LINE_CHART: '堆叠面积图',
  BASE_BAR_CHART: '基础柱状图',
  STACK_BAR_CHART: '堆叠柱状图',

  LINE_CHART_DESC: '折线图主要用来展示数据相随着时间推移的趋势或变化。',
  BASE_LINE_CHART_DESC:
    '折线图主要用来展示数据相随着时间推移的趋势或变化。折线图非常适合用于展示一个连续的二维数据，如某网站访问人数或商品销量价格的波动。',
  STACK_LINE_CHART_DESC:
    '堆积面积图是一种特殊的面积图，可以用来比较在一个区间内的多个变量。如果有多个数据系列，并想分析每个类别的部分到整体的关系，并展现部分量对于总量的贡献时，使用堆积面积图是非常合适的选择。',
  BAR_CHART_DESC:
    '柱状图是最常见的图表类型，通过使用水平或垂直方向柱子的高度来显示不同类别的数值。',
  BASE_BAR_CHART_DESC:
    '基础柱状图的一个轴显示正在比较的类别，而另一个轴代表对应的刻度值。',
  STACK_BAR_CHART_DESC:
    '堆叠柱状图是柱状图的扩展，不同的是，柱状图的数据值为并行排列，堆叠柱图则是一个个叠加起来的。它可以展示每一个分类的总量，以及该分类包含的每个小分类的大小及占比，因此非常适合处理部分与整体的关系。',
  SELECT_CHART_TYPE: '选择图表类型',
  SELECT_CHART_TYPE_MODAL_DESC: '选择您要添加的自定义图表类型',
  EMPTY_CHART_PLACEHOLDER: '图表将显示在此区域',
  DISPLAY_POSITION: '图表布局位置',
  DISPLAY_FORMAT: '显示格式',
  FIELD_NAME: '字段名称',
  COLUMN_NAME: '列名称',
  METRIC_NAME: '图例名称',
  GRAPH_NAME: '图表名称',
  TABLE: '表格',
  VALUE_FOMATER: '数据取值',
  Y_AXIS: 'Y轴',
  'Custom Monitoring': '自定义监控',
  CustomMonitorDashboards: '自定义监控面板',
  CustomMonitorDashboard: '自定义监控面板',
  CUSTOMMONITORDASHBOARD_DESC: '用户可以根据自己需求定义应用监控面板',
  CUSTOMMONITORDASHBOARD_CREATE_DESC: '用户可以根据自己需求定义应用监控面板',

  'Default Color': '默认配色',
  'Cool Color': '冷色调',
  'Warm Color': '暖色调',
}
