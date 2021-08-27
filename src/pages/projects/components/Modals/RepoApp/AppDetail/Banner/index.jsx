import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@kube-design/components'

import { Image } from 'components/Base'
import styles from './index.scss'

class Banner extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    icon: PropTypes.string,
    onClickBack: PropTypes.func,
  }

  handleClickBack = () => {
    this.props.onClickBack ? this.props.onClickBack() : history.back()
  }

  render() {
    const { title, desc, icon } = this.props
    return (
      <div className={styles.banner}>
        <div className={styles.back} onClick={this.handleClickBack}>
          <Icon name="return" size={20} />
          <span>{t('Back')}</span>
        </div>
        <div className={styles.intro}>
          <span className={styles.icon}>
            <Image src={icon} alt="" iconLetter={title} iconSize={48} />
          </span>
          <div className={styles.text}>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
        <div className={styles.rightIcon}>
          <span className={styles.image}>
            <Image src={icon} alt="" iconLetter={title} iconSize={200} />
          </span>
        </div>
      </div>
    )
  }
}

export default Banner
