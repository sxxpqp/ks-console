module.exports = {
  Monitoring: '監控',
  'Monitoring Center': '監控中心',
  'Physical Resources': '物理資源',
  'Physical Resources Monitoring': '物理資源監控',
  'Service Component Monitoring': '服務組件監控',
  'Application Resources': '應用資源',
  'Application Resources Monitoring': '應用資源監控',

  'Node Count': '節點數量',
  'Cluster Status': '集群狀態',
  'Cluster Status Monitoring': '集群狀態監控',
  'Cluster Monitors': '集群監控',
  'Cluster Resource Monitoring': '集群資源監控',
  'ETCD Monitoring': 'ETCD監控',
  'ETCD Service Status': 'ETCD服務狀態',
  'ETCD Nodes': 'ETCD節點',
  'External ETCD': '外部ETCD',
  'APIServer Monitoring': 'APIServer監控',
  'Scheduler Monitoring': '調度器監控',
  'Historical Monitoring': '歷史監控',
  'Node Usage Ranking': '節點用量排行',
  'Usage Ranking': '用量排行',
  'Resources Usage': '資源用量',
  'Resources Usage Trend': '資源用量趨勢',
  'Physical Resources Usage': '物理資源用量',
  'Application Resources Usage': '應用資源用量',
  'Projects Change Trend': '項目變化趨勢',
  'Projects Count': '項目數量',
  'Cluster Resources Usage': '集群資源使用情況',
  'Cluster Node Status': '集群節點狀態',
  'Component Status': '組件狀態',
  'Running Status': '運行狀態',
  'Disk Usage': '硬碟使用量',
  'Disk Capacity': '硬碟容量',
  'inode Utilization': 'inode 使用率',
  'Running Pods': '運行中的容器組',
  'Abnormal Pods': '異常容器組',

  'Controller Manager': '管理控制中心',
  'K8s Scheduler': 'K8s 調度器',
  Scheduler: '調度器',
  Node: '節點',

  'Select Time Range': '選擇時間範圍',
  'Custom Time Range': '自定義時間範圍',
  'Only Show Selected': '僅顯示已選',
  'View All Replicas': '查看全部副本',
  'View All': '查看全部',
  'View More': '查看更多',

  Interval: '間隔',
  Last: '最近',
  TIME_S: '{num} 秒',
  TIME_M: '{num} 分鐘',
  TIME_H: '{num} 小時',
  TIME_D: '{num} 天',
  UTILIZATION: '使用率',
  RESOURCE_USAGE_TITLE: '資源使用情况',
  MONITORING_CLUSTER_DESC: '監控集群的運行狀態',
  MONITORING_PHYSICAL_DESC: '監控集群物理資源的運行狀態',
  MONITORING_APPLICATION_DESC: '監控集群應用資源的運行狀態',
  TIMERANGE_SELECTOR_MSG: '結束時間需晚於開始時間',
  MONITORING_SELECT_LIMIT_MSG: '最多可以選擇 10 個資源',

  second: '秒',
  ms: '毫秒',
  times: '次',
  'times/s': '次/秒',
  'Raft Proposals': 'Raft 提議',
  'Proposal Commit Rate': '提議提交速率',
  'Proposal Apply Rate': '提議應用速率',
  'Proposal Failure Rate': '提議失敗速率',
  'Proposal Pending Total': '提議待處理總數',
  'DB Size': '資料庫大小',
  'Client Traffic': '客戶端流量',
  Received: '接收',
  Sent: '發送',
  'gRPC Stream Messages': 'gRPC 流式訊息',
  'WAL Fsync': 'WAL 紀錄同步時間',
  'DB Fsync': '資料庫同步時間',
  'Request Latency': '請求延遲',
  'Total Average': '總平均值',
  'APIs Average': 'APIs 平均值',
  'Request Per Second': '每秒請求數',
  Request: '請求',
  'Attempt Frequency': '調度次數',
  'Attempt Rate': '調度速率',
  'Scheduling Latency': '調度延遲',

  AVERAGE: '平均值',
  TOTAL_AVERAGE: '總平均值',
  SCHEDULED_SUCCESS: '成功',
  SCHEDULED_ERROR: '錯誤',
  SCHEDULED_FAIL: '失敗',
  ETCD_NODE_TITLE: 'ETCD節點',
  ETCD_LEADER_TITLE: '是否有Leader',
  ETCD_CHANGES_TITLE: 'Leader變更次數 (1小時内)',
  ETCD_STATUS: '服務 <span>狀態</span>',
  ETCD_PROPOSAL: 'Raft <span>提議</span>',
  ETCD_DB_SIZE: '資料庫 <span>大小</span>',
  ETCD_CLIENT_TRAFFIC: '客戶端 <span>流量</span>',
  REQUEST_LATENCY: '請求 <span>延遲</span>',
  REQUEST_RATE: '請求 <span>速率</span>',
  ATTEMPT_FREQUENCY: '調度 <span>次數</span>',
  ATTEMPT_RATE: '調度 <span>速率</span>',
  PROPOSAL_COMMITTED: '提議提交速率',
  PROPOSAL_APPLIED: '提議應用速率',
  PROPOSAL_FAILED: '提議失敗速率',
  PROPOSAL_PENDING: '提議待處理數',

  EDIT_TEMPLATE: '編輯模板',
  SAVE_TEMPLATE: '保存模板',

  'No Refreshing': '不刷新',

  GRAPH_COLORS: '圖表配色',
  SINGLE_GRAPH_TYPE: '最常見的圖表類型',
  SINGLE_GRAPH_TYPE_NAME: '基礎圖',
  STACKED_GRAPH_TYPE: '堆疊圖',
  STACKED_GRAPH_TYPE_DESC: '適用於各大類總量及分量之間的對比顯示',
  CHART_TYPES: '圖表類型',
  GRAPH_TYPES: '圖例類型',
  ADD_MONITOR_ITEM: '添加監控項',
  ADD_MONITOR_ROW: '添加監控組',
  MONITOR_TYPE_NO_SUPPORT: '目前不支持該類型',
  TABLE_SETTINGS: '表格設置',
  PER_PAGE_LINES: '每頁行數',
  CUSTOM_DISPLAY_STYLE: '設置顯示格式',
  CUSTOM_DISPLAY_MODAL_DESC: '根據需要定制Table中的顯示格式',
  DATA_TYPE: '數據類型',
  DECIMALS: '精確位',
  THRESHOLD_FILL: '臨界值填充',
  THRESHOLD_FILL_DESC: '可以設置臨界值，數值超出後可以自動更改樣式提示',
  HIGHT_RULES: '高亮規則',
  TIME_FORMAT: '時間格式',
  MONITOR_METRICS: '監控指標',
  DEBUGB_DATA: '除錯數據',
  LINE_CHART: '折線圖',
  BAR_CHART: '柱狀圖',
  SINGLE_STATE_CHART: '即時文本',
  APPLICABLE_SCENE: '適用場景',
  BASE_LINE_CHART: '基礎折線圖',
  STACK_LINE_CHART: '堆疊面積圖',
  BASE_BAR_CHART: '基礎柱狀圖',
  STACK_BAR_CHART: '堆疊柱狀圖',

  LINE_CHART_DESC: '折線圖主要用來展示數據隨著時間推移的趨勢或變化。',
  BASE_LINE_CHART_DESC:
    '折線圖主要用來展示數據相隨著時間推移的趨勢或變化。折線圖非常適合用於展示一個連續的二維數據，如某網站訪問人數或商品銷量價格的波動。',
  STACK_LINE_CHART_DESC:
    '堆積面積圖是一種特殊的面積圖，可以用來比較在一個區間内的多個變量。如果有多個數據系列，並想分析每個類别的部分到整體的關係，並展現部分量對於總量的貢獻時，使用堆積面積圖是非常合適的選擇。',
  BAR_CHART_DESC:
    '柱狀圖是最常見的圖表類型，通過使用水平或垂直方向柱子的高度來顯示不同類别的數值。',
  BASE_BAR_CHART_DESC:
    '基礎柱狀圖的一個軸顯示正在比較的類别，而另一個軸代表對應的刻度值。',
  STACK_BAR_CHART_DESC:
    '堆疊柱狀圖是柱狀圖的擴展，不同的是，柱狀圖的數據值為並行排列，堆疊柱圖則是一個個疊加起來的。它可以展示每一個分類的總量，以及該分類包含的每個小分類的大小及占比，因此非常適合處理部分與整體的關係。',
  SELECT_CHART_TYPE: '選擇圖表類型',
  SELECT_CHART_TYPE_MODAL_DESC: '選擇您要添加的自定義圖表類型',
  DISPLAY_POSITION: '圖表布局位置',
  DISPLAY_FORMAT: '顯示格式',
  FIELD_NAME: '字段名稱',
  COLUMN_NAME: '列名稱',
  METRIC_NAME: '圖例名稱',
  GRAPH_NAME: '圖表名稱',
  TABLE: '表格',
  VALUE_FOMATER: '數據取值',
  Y_AXIS: 'Y軸',
  'Custom Monitoring': '自定義監控',
  CustomMonitorDashboards: '自定義監控面板',
  CustomMonitorDashboard: '自定義監控面板',
  CUSTOMMONITORDASHBOARD_DESC: '用戶可以根據自己需求定義應用監控面板',
  CUSTOMMONITORDASHBOARD_CREATE_DESC: '用戶可以根據自己需求定義應用監控面板',

  'Default Color': '預設配色',
  'Cool Color': '冷色調',
  'Warm Color': '暖色調',

  EMPTY_CHART_PLACEHOLDER: '圖表將顯示在此區域',
}
