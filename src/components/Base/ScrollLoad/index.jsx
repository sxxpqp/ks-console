import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get, throttle } from 'lodash'

import { Loading } from '@kube-design/components'
import { Empty } from 'components/Base'

import styles from './index.scss'

const isRemainingData = ({ data, total }) =>
  !isEmpty(data) && data.length < total

export default class ScrollLoad extends React.Component {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    empty: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.node,
    ]),
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onFetch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    wrapperClassName: '',
    width: '100%',
    height: '100%',
    isEmpty: false,
    loading: true,
    data: [],
    total: 10,
    page: 1,
    onFetch() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: props.loading,
      loadMore: false,
    }

    this.containerRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (state.loadMore) {
      return {
        loading: false,
        loadMore: isRemainingData(props),
      }
    }
    if (props.loading !== state.loading) {
      return {
        loading: props.loading,
      }
    }

    return null
  }

  componentDidMount() {
    this.props.onFetch()
  }

  isElementAtBottom = ele =>
    Math.abs(ele.scrollTop + ele.clientHeight - ele.scrollHeight) < 1

  handleScroll = throttle(() => {
    const ele = get(this.containerRef, 'current', {})

    if (isRemainingData(this.props) && this.isElementAtBottom(ele)) {
      this.setState({ loadMore: true }, () => {
        const { page, onFetch } = this.props
        onFetch({ more: true, page: page + 1 })
      })
    }
  }, 300)

  renderContent() {
    const { empty, data, loading, children } = this.props
    const { loadMore } = this.state

    if (loading && !loadMore) {
      return null
    }

    if (isEmpty(data) || !children) {
      return empty || <Empty className={styles.empty} desc={t('No Data')} />
    }

    return children
  }

  render() {
    const { wrapperClassName, className, width, minHeight, height } = this.props
    const { loading, loadMore } = this.state
    const allStyles = {
      width,
      height,
    }

    return (
      <div className={classnames(styles.wrapper, wrapperClassName)}>
        <Loading spinning={loading}>
          <div
            ref={this.containerRef}
            className={styles.main}
            style={allStyles}
            onScrollCapture={this.handleScroll}
          >
            <div
              className={classnames(styles.content, className)}
              style={{ minHeight: minHeight || height }}
            >
              {this.renderContent()}
            </div>
            {loadMore && (
              <div className={styles.loadMore}>
                <Loading />
              </div>
            )}
          </div>
        </Loading>
      </div>
    )
  }
}
