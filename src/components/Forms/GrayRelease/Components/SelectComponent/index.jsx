import React from 'react'
import PropTypes from 'prop-types'

import { Loading } from '@kube-design/components'

import Card from '../Card'

import styles from './index.scss'

export default class SelectComponent extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    value: '',
    onChange() {},
    onSelect() {},
  }

  state = {
    loadingName: '',
  }

  handleCardSelect = (node, selected) => {
    const { onChange, onSelect } = this.props

    this.setState({ loadingName: node.name })
    onSelect(selected ? node.name : '', value => {
      onChange(value)
      this.setState({ loadingName: '' })
    })
  }

  render() {
    const { data, value, loading } = this.props
    const { loadingName } = this.state

    if (loading) {
      return (
        <div className="text-center margin-t12">
          <Loading spinning={true} />
        </div>
      )
    }

    return (
      <div className={styles.wrapper}>
        {data.map(item => (
          <Card
            key={item.name}
            component={item}
            value={item.name === value}
            loading={item.name === loadingName}
            onSelect={this.handleCardSelect}
          />
        ))}
      </div>
    )
  }
}
