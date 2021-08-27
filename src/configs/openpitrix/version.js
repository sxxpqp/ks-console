export const DEFAULT_QUERY_STATUS =
  'draft|submitted|rejected|in-review|passed|active|suspended'

export const STATUS_TRANSFER_MAP = {
  active: 'published',
  suspended: 'recalled',
  suspend: 'recall',
}

export const STATUS_TO_ICON = {
  submitted: 'review',
  'in-review': 'review',
  rejected: 'suspended',
  active: 'passed',
}

export const CAN_EDIT_STATUS = ['draft', 'rejected']

export const CAN_DELETE_STATUS = ['draft', 'rejected', 'passed', 'suspended']

export const APP_STORE_ACTIONS = ['suspend', 'recover']

export const STATUS_TO_ACTION = {
  draft: 'submit',
  submitted: 'cancel',
  rejected: 'submit',
  passed: 'release',
  active: 'view',
}

export const STATUS_TO_ACTION_ADMIN = {
  active: 'suspend',
  suspended: 'recover',
}

export const ACTION_TO_STATUS = {
  suspend: 'active',
  recover: 'suspended',
}

export const HANDLE_TYPE_TO_SHOW = {
  recover: 'activate',
}

export const ACTION_TO_NAME = {
  submit: 'Submit for Review',
  cancel: 'Cancel Review',
  release: 'Release to Store',
  view: 'View in Store',
  suspend: 'Suspend Version',
  recover: 'Activate Version',
}

export const REVIEW_PASS_ACTIONS = [
  {
    role: 'isv',
    action: 'review',
  },
  {
    role: 'isv',
    action: 'pass',
  },
  {
    role: 'business',
    action: 'review',
  },
  {
    role: 'business',
    action: 'pass',
  },
  {
    role: 'technical',
    action: 'review',
  },
  {
    role: 'technical',
    action: 'pass',
  },
]
