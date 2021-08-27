import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import Secret from './Secret'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class ServiceAccountDetail extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore
    this.module = props.module
  }

  render() {
    const { detail } = this.store
    const secrets = get(detail, 'secrets')
    const serviceAccountName = get(detail, 'name')

    return (
      <div>
        <div className={styles.secretWrapper}>
          {secrets.map(({ name }) => (
            <Secret
              secret={name}
              serviceAccountName={serviceAccountName}
              key={name}
              {...this.props}
            />
          ))}
        </div>
      </div>
    )
  }
}
