import NodeMetricsConfig from './node'
import WorkloadMetricsConfig from './workload'
import PodMetricsConfig from './pod'

export const RESOURCE_METRICS_CONFIG = {
  node: NodeMetricsConfig,
  workload: WorkloadMetricsConfig,
  pod: PodMetricsConfig,
}

export const ALL_METRICS_CONFIG = {
  ...NodeMetricsConfig,
  ...WorkloadMetricsConfig,
  ...PodMetricsConfig,
}
