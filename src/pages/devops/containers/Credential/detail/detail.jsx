import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import { Icon } from '@kube-design/components'
import { Card } from 'components/Base'

import styles from './index.scss'

@inject('detailStore')
@observer
class Events extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
  }

  getColumns = () => [
    {
      title: t('name'),
      dataIndex: 'name',
      width: '50%',
    },
    {
      title: t('Record'),
      dataIndex: 'record',
      width: '50%',
    },
  ]

  render() {
    const { detail } = this.props.detailStore

    return (
      <Card title={t('Account')}>
        <div className={styles.card_content}>
          <div className={styles.icon}>
            <Icon name="key" size={40} />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{detail.id || '-'}</div>
            <div className={styles.desc}>{`${t('type')}: ${t(
              detail.type
            )}`}</div>
          </div>
        </div>
      </Card>
    )
  }
}

export default Events
