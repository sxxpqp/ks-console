import React from 'react'
import { get, set } from 'lodash'
import { Checkbox } from '@kube-design/components'

import styles from './index.scss'

export default class SyncTimeZone extends React.PureComponent {
  state = {
    isCheck: get(this.props.data, 'volumeMounts', []).some(
      vm => vm.mountPath === '/etc/localtime'
    ),
  }

  handleCheck = () => {
    this.setState(
      ({ isCheck }) => ({ isCheck: !isCheck }),
      () => {
        const vms = get(this.props.data, 'volumeMounts', [])
        if (this.state.isCheck) {
          set(this.props.data, 'volumeMounts', [
            ...vms,
            {
              name: 'host-time',
              mountPath: '/etc/localtime',
              readOnly: true,
            },
          ])
        } else {
          set(
            this.props.data,
            'volumeMounts',
            vms.filter(vm => vm.mountPath !== '/etc/localtime')
          )
        }
      }
    )
  }

  render() {
    const { isCheck } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Checkbox checked={isCheck} onChange={this.handleCheck}>
            {t('Sync Host Timezone')}
          </Checkbox>
        </div>
        <div className={styles.desc}>{t('SYNC_HOST_TIMEZONE_DESC')}</div>
      </div>
    )
  }
}
