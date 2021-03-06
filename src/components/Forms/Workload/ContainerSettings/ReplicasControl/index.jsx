import React from 'react'
import PropTypes from 'prop-types'
import { set, debounce } from 'lodash'
import { Button, Columns, Column } from '@kube-design/components'

import { NumberInput } from 'components/Inputs'

import styles from './index.scss'

export default class ReplicasControl extends React.Component {
  static propTypes = {
    template: PropTypes.object,
  }

  state = {
    replicas: this.props.replicas || 1,
  }

  triggerChange = debounce(() => {
    const { template, onChange } = this.props
    const { replicas } = this.state

    set(template, 'spec.replicas', replicas)

    onChange && onChange(replicas)
  }, 200)

  handleSubStract = () => {
    this.setState(
      ({ replicas }) => ({ replicas: Math.max(replicas - 1, 1) }),
      () => {
        this.triggerChange()
      }
    )
  }

  handleAdd = () => {
    this.setState(
      ({ replicas }) => ({ replicas: replicas + 1 }),
      () => {
        this.triggerChange()
      }
    )
  }

  handleChange = replicas => {
    this.setState({ replicas }, () => {
      this.triggerChange()
    })
  }

  renderReplicas() {
    const { replicas } = this.state
    return (
      <div className={styles.replicas}>
        <div className="margin-b8">{t('Pod Replicas')}</div>
        <div className="flexbox">
          <Button type="flat" icon="substract" onClick={this.handleSubStract} />
          <NumberInput value={replicas} onChange={this.handleChange} />
          <Button type="flat" icon="add" onClick={this.handleAdd} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Columns className="is-vcentered is-2">
          <Column className="is-narrow">{this.renderReplicas()}</Column>
        </Columns>
      </div>
    )
  }
}
