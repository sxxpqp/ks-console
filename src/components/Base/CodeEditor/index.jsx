import React, { lazy, Suspense, PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Loading } from '@kube-design/components'

import styles from './index.scss'

const AceEditor = lazy(() =>
  import(/* webpackChunkName: "react-ace" */ './AceEditor')
)

class CodeEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
    mode: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: {},
    mode: 'yaml',
    options: {},
    onChange() {},
  }

  render() {
    const { className, mode, options, value, onChange } = this.props

    return (
      <Suspense fallback={<Loading className="ks-page-loading" />}>
        <AceEditor
          {...options}
          className={classnames(styles.editor, className)}
          value={value}
          mode={mode}
          onChange={onChange}
        />
      </Suspense>
    )
  }
}

export default CodeEditor
