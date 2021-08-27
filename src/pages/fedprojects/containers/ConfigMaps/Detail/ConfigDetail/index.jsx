import React from 'react'
import { observer, inject } from 'mobx-react'

import { Card } from 'components/Base'

import styles from './index.scss'

@inject('detailStore')
@observer
class ConfigMapDetail extends React.Component {
  constructor(props) {
    super(props)

    this.store = props.detailStore
    this.module = props.module
  }

  renderContent(data = {}) {
    return (
      <div className={styles.wrapper}>
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <div className="h6">{key}</div>
              <pre className={styles.value}>{value}</pre>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const { detail, isLoading } = this.store

    return (
      <Card title={t('Config Value')} loading={isLoading}>
        {this.renderContent(detail.data)}
      </Card>
    )
  }
}

export default ConfigMapDetail
