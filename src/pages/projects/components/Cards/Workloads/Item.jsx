import { get } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Text } from 'components/Base'
import StatusReason from 'projects/components/StatusReason'
import WorkloadStatus from 'projects/components/WorkloadStatus'
import { getLocalTime, getDisplayName } from 'utils'
import { ICON_TYPES } from 'utils/constants'
import { getWorkloadStatus } from 'utils/status'

import styles from './index.scss'

export default class WorkloadItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    detail: PropTypes.object,
  }

  static defaultProps = {
    prefix: '',
    detail: {},
  }

  getDescription(detail) {
    const { status, reason } = getWorkloadStatus(detail, detail.module)
    if (reason) {
      return <StatusReason status={status} reason={t(reason)} data={detail} />
    }

    const { updateTime, createTime } = detail
    if (updateTime) {
      return `${t('Updated at')} ${getLocalTime(updateTime).fromNow()}`
    }

    return `${t('Created at')} ${getLocalTime(createTime).fromNow()}`
  }

  render() {
    const { detail, prefix } = this.props

    if (!detail) {
      return null
    }

    const version = get(
      detail,
      'annotations["deployment.kubernetes.io/revision"]'
    )

    return (
      <div className={styles.item}>
        <Text
          icon={ICON_TYPES[detail.module]}
          title={
            <Link to={`${prefix}/${detail.module}/${detail.name}`}>
              {getDisplayName(detail)}
            </Link>
          }
          description={this.getDescription(detail)}
        />
        <Text
          title={<WorkloadStatus data={detail} module={detail.module} />}
          description={t('Status')}
        />
        <Text
          title={version ? `#${version}` : '-'}
          description={t('Version')}
        />
      </div>
    )
  }
}
