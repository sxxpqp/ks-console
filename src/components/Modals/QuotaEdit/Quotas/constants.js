import { QUOTAS_MAP } from 'utils/constants'

export const RESERVED_MODULES = [
  'limits.cpu',
  'requests.cpu',
  'limits.memory',
  'requests.memory',
]

export const QUOTAS_KEY_MODULE_MAP = Object.entries(QUOTAS_MAP).reduce(
  (prev, cur) => ({
    ...prev,
    [cur[1].name]: cur[0],
  }),
  {}
)

export const FEDERATED_PROJECT_UNSOPPORT_QUOTA = [
  'daemonsets',
  'jobs',
  'cronjobs',
]
