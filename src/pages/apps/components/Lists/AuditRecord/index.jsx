import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'
import { Loading } from '@kube-design/components'

import VersionStatus from 'apps/components/VersionStatus'
import AuditStore from 'stores/openpitrix/audit'
import { getLocalTime } from 'utils'

import styles from './index.scss'

@observer
export default class AuditRecord extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    appId: PropTypes.string,
    versionId: PropTypes.string,
  }

  static defaultProps = {
    appId: '',
    versionId: '',
  }

  constructor(props) {
    super(props)
    this.store = new AuditStore()
  }

  componentDidMount() {
    const { appId, versionId } = this.props
    this.store.fetchList({
      app_id: appId,
      version_id: versionId,
      noLimit: true,
    })
  }

  renderItem(item, index) {
    return (
      <ul key={`${index}-${item.status_time}`}>
        <li>
          <VersionStatus type={item.status} name={item.status} />
        </li>
        <li>{item.operator}</li>
        <li>{item.message || item.review_id || '-'}</li>
        <li className={styles.time}>
          {getLocalTime(item.status_time).format('YYYY-MM-DD HH:mm:ss')}
        </li>
      </ul>
    )
  }

  renderContent() {
    const { data } = this.store.list

    return (
      <div className={styles.itemMain}>
        {isEmpty(data) ? (
          <div className={styles.empty}>{t('RESOURCE_NOT_FOUND')}</div>
        ) : (
          data.map((item, index) => this.renderItem(item, index))
        )}
      </div>
    )
  }

  render() {
    const { className } = this.props
    const { isLoading } = this.store.list

    return (
      <div className={classnames(styles.main, className)}>
        {isLoading ? (
          <Loading className={styles.loading} />
        ) : (
          this.renderContent()
        )}
      </div>
    )
  }
}
