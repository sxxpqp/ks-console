import React from 'react'
import PropTypes from 'prop-types'

import Markdown from 'components/Base/Markdown'

import styles from './index.scss'

export default class AppReadme extends React.PureComponent {
  static propTypes = {
    readme: PropTypes.string,
  }

  static defaultProps = {
    readme: '',
  }

  render() {
    const { readme } = this.props

    if (readme) {
      return <Markdown source={readme} className={styles.markdown} />
    }

    return <p>{t('The version has no documentation.')}</p>
  }
}
