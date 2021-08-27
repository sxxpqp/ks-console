import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Icon, Button } from '@kube-design/components'

import styles from './index.scss'

export default class NotifyConfirm extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    width: PropTypes.number,
    type: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    btns: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    width: 'auto',
    type: 'info',
    title: 'title',
    content: 'content',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      show: props.visible,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.visible !== state.show) {
      return { show: props.visible }
    }

    return null
  }

  getIconColr = () => {
    const { type } = this.props
    const colors = {
      primary: '#fff',
    }

    switch (type) {
      default:
      case 'info':
        colors.secondary = '#329dce'
        break
    }
    return colors
  }

  handleCancel = () => {
    this.setState({ show: false }, () => {
      const timer = setTimeout(() => {
        this.props.onCancel()
        clearTimeout(timer)
      }, 1000)
    })
  }

  renderBtns() {
    const {
      btns,
      confirmText,
      cancelText,
      onConfirm,
      isSubmitting,
    } = this.props

    if (btns) return btns

    return (
      <div>
        <Button onClick={this.handleCancel}>{t(cancelText)}</Button>
        <Button type="control" onClick={onConfirm} loading={isSubmitting}>
          {t(confirmText)}
        </Button>
      </div>
    )
  }

  renderCard() {
    const { visible, width, title, content } = this.props

    if (!visible) return null

    const { show } = this.state
    const style = {
      width,
    }

    return (
      <div
        className={classnames(styles.card, {
          [styles.in]: show,
          [styles.out]: !show,
        })}
        style={style}
      >
        <div className={styles.cardMain}>
          <div className={styles.title}>
            <Icon name="information" size={20} color={this.getIconColr()} />
            <strong>{title}</strong>
          </div>
          <div className={styles.content}>{content}</div>
        </div>
        <div className={styles.cardFoot}>{this.renderBtns()}</div>
      </div>
    )
  }

  render() {
    return <div className={styles.wrapper}>{this.renderCard()}</div>
  }
}
