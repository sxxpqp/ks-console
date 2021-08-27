import Base from './base'

export default class Audit extends Base {
  resourceName = 'audits'

  sortKey = 'status_time'
}
