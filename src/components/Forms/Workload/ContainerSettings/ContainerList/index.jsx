import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { List } from 'components/Base'

import Card from './Card'
import QuotaCheck from './QuotaCheck'

import styles from './index.scss'

export default class ContainerList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onShow: PropTypes.func,
    readOnlyList: PropTypes.array,
    specTemplate: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    name: '',
    value: [],
    readOnlyList: [],
    specTemplate: {},
    onChange() {},
    onShow() {},
    onDelete() {},
  }

  handleAdd = () => {
    this.props.onShow()
  }

  handleEdit = data => {
    this.props.onShow(data)
  }

  handleDelete = container => {
    const { value, specTemplate, onChange, onDelete } = this.props

    if (container.type === 'init' && specTemplate.initContainers) {
      specTemplate.initContainers = specTemplate.initContainers.filter(
        item => item.name !== container.name
      )
      onChange([...value])
    } else {
      onChange(value.filter(item => item.name !== container.name))
    }

    onDelete && onDelete(container.name)
  }

  renderQuotaCheck() {
    const { value, replicas } = this.props
    const {
      specTemplate: { initContainers = [] },
      leftQuota,
    } = this.props
    return (
      <QuotaCheck
        className="margin-b12"
        containers={value}
        initContainers={initContainers}
        leftQuota={leftQuota}
        replicas={replicas}
      />
    )
  }

  renderContainers() {
    const { value, readOnlyList } = this.props

    return value.map(item => (
      <Card
        container={item}
        key={item.name}
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
        readOnly={readOnlyList.includes(item.name)}
      />
    ))
  }

  renderInitContainers() {
    const {
      specTemplate: { initContainers = [] },
    } = this.props

    return initContainers.map(item => (
      <Card
        container={item}
        key={item.name}
        type="init"
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
      />
    ))
  }

  renderAdd() {
    const {
      value,
      specTemplate: { initContainers = [] },
    } = this.props

    return (
      <List.Add
        type={value.length <= 0 && initContainers.length <= 0 && 'empty'}
        onClick={this.handleAdd}
        icon="docker"
        title={`${t('Add ')}${t('Container Image')}`}
        description={'支持从镜像仓库拉取镜像以及通过代码构建新的镜像并部署'}
      />
    )
  }

  render() {
    const { className } = this.props
    // const { className, projectDetail } = this.props

    return (
      <div className={classNames(styles.wrapper, className)}>
        {/* 项目配额说明 */}
        {/* {projectDetail && this.renderQuotaCheck()} */}
        {this.renderInitContainers()}
        {this.renderContainers()}
        {this.renderAdd()}
      </div>
    )
  }
}
