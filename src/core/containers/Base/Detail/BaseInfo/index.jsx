import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isString } from 'lodash'
import { Link } from 'react-router-dom'

import { Icon } from '@kube-design/components'
import BtnGroup from './BtnGroup'
import Label from './Label'
import Attributes from './Attributes'

import styles from './index.scss'

class BaseInfo extends React.Component {
  static propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    name: PropTypes.string,
    desc: PropTypes.string,
    operations: PropTypes.array,
    labels: PropTypes.object,
    attrs: PropTypes.array,
  }

  static defaultProps = {
    icon: 'appcenter',
    name: '',
    desc: '',
  }

  renderNav() {
    const { rootStore, breadcrumbs, noBread } = this.props
    const goBack = () => {
      const prevPath = localStorage.getItem('prevPath')
      if (prevPath) {
        rootStore.routing.push(prevPath)
        localStorage.removeItem('prevPath')
      } else {
        rootStore.routing.goBack()
      }
    }

    if (isEmpty(breadcrumbs)) {
      return null
    }

    const br = breadcrumbs[0]
    return noBread ? (
      <div onClick={goBack} className={styles.breadcrumbs}>
        <Icon name="chevron-left" size={20} />
        <span>返回</span>
      </div>
    ) : (
      <Link to={br.url} className={styles.breadcrumbs}>
        <Icon name="chevron-left" size={20} />
        {br.label}
      </Link>
    )
  }

  renderName() {
    const { icon, desc, name } = this.props

    return (
      <div className={styles.name} title={name} data-test="detail-title">
        {isString(icon) ? <Icon name={icon} size={28} /> : icon}
        {desc}
      </div>
    )
  }

  renderDesc() {
    const { name } = this.props
    return (
      <div className={styles.desc} data-test="detail-desc">
        ID：{name}
      </div>
    )
  }

  renderBtnGroup() {
    const { operations } = this.props

    if (isEmpty(operations)) return null

    return <BtnGroup options={operations} limit={2} />
  }

  renderLabels() {
    const { labels } = this.props

    if (isEmpty(labels)) return null

    return (
      <div className={styles.labels} data-test="detail-labels">
        <div className="h6">{t('Labels')}</div>
        <div className={styles.labelList}>
          {Object.entries(labels).map(([name, value]) => (
            <Label key={name} name={name} value={value} />
          ))}
        </div>
      </div>
    )
  }

  renderAttributes() {
    const { attrs } = this.props

    if (isEmpty(attrs)) return null

    return (
      <div className={styles.attrs} data-test="detail-attrs">
        <div className="h6">{t('Details')}</div>
        <Attributes>
          {attrs.map(({ name, value, show = true, ...rest }) => {
            if (!show) return null

            return (
              <Attributes.Item
                key={name}
                name={name}
                value={value === undefined || value === null ? '-' : value}
                {...rest}
              />
            )
          })}
        </Attributes>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.card}>
        <div className={styles.base}>
          {this.renderNav()}
          {this.renderName()}
          {this.renderDesc()}
          {this.renderBtnGroup()}
        </div>
        <div className={styles.extra}>
          {this.renderLabels()}
          {this.renderAttributes()}
        </div>
      </div>
    )
  }
}

export default BaseInfo
