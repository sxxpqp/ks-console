import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Editor from 'for-editor'

import styles from './index.scss'

const toolbar = {
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  img: false,
  link: true,
  code: true,
  preview: true,
  expand: true,
  undo: true,
  redo: true,
  save: false,
  subfield: true,
}

@observer
export default class ReadmeEdit extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    store: PropTypes.object,
    handleChange: PropTypes.func,
  }

  static defaultProps = {
    detail: {},
    store: {},
    handleChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      readme: props.detail.abstraction,
    }
  }

  handleChange = value => {
    this.setState({ readme: value })
    this.props.handleChange(value, 'abstraction')
  }

  render() {
    const { readme } = this.state

    return (
      <>
        <div className={styles.header}>{t('App Introduction')}</div>
        <div className={styles.readmeEdit}>
          <Editor
            value={readme}
            onChange={this.handleChange}
            placeholder={`${t('Start editing')}...`}
            toolbar={toolbar}
          />
        </div>
      </>
    )
  }
}
