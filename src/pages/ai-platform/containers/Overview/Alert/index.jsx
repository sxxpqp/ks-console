import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon } from '@kube-design/components'
import { Panel } from 'components/Base'
import { Row, Button } from 'antd'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class Alert extends Component {
  renderEmpty() {
    return (
      <div className={styles.empty}>
        <Icon name="backup" size={32} />
        <div>{t('No Relevant Data')}</div>
      </div>
    )
  }

  render() {
    return (
      <Panel title="告警信息">
        {this.props.lists ? (
          <Row justify="end">
            <Button type="link" onClick={() => this.handleClick('more')}>
              查看更多
            </Button>
          </Row>
        ) : (
          this.renderEmpty()
        )}
      </Panel>
    )
  }
}
