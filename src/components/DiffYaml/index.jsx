import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'react-fast-compare'
import { Icon } from '@kube-design/components'

import { createPatch } from 'diff'
import { parse, html } from 'diff2html'

import 'diff2html/bundles/css/diff2html.min.css'
import styles from './index.scss'

export default class DiffYaml extends Component {
  static propTypes = {
    title: PropTypes.string,
    datas: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    datas: ['', ''],
  }

  state = {
    mode: 'line-by-line',
    diffHtml: this.getDiffHtml(this.props.datas),
  }

  getDiffHtml([oldData, newData], options = {}) {
    const diffStr = createPatch('yaml', oldData, newData, '', '', {
      context: -1,
    })
    const diffJson = parse(diffStr)
    return html(diffJson, {
      drawFileList: false,
      ...options,
    })
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.datas, this.props.datas)) {
      this.setState({
        diffHtml: this.getDiffHtml(this.props.datas, {
          outputFormat: this.state.mode,
        }),
      })
    }
  }

  handleModeChange = mode => () =>
    this.setState({
      mode,
      diffHtml: this.getDiffHtml(this.props.datas, {
        outputFormat: mode,
      }),
    })

  render() {
    const { title, description } = this.props
    return (
      <div>
        <div className={styles.header}>
          <Icon name="terminal" size={20} />
          <span>{title}</span>
          <Icon
            name="chevron-down"
            clickable
            size={20}
            onClick={this.handleModeChange('line-by-line')}
          />
          <Icon
            name="chevron-right"
            clickable
            size={20}
            onClick={this.handleModeChange('side-by-side')}
          />
          <span className="float-right">{description}</span>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.diffHtml,
          }}
        />
      </div>
    )
  }
}
