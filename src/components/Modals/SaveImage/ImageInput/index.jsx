import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
// import classnames from 'classnames'
// import moment from 'moment-mini'
import { Form } from '@kube-design/components'
// import { Form, Button, Icon, Loading, Tooltip } from '@kube-design/components'

// import { formatSize } from 'utils'

import { PATTERN_IMAGE_TAG } from 'utils/constants'
// import { PATTERN_IMAGE, PATTERN_IMAGE_TAG } from 'utils/constants'

import ContainerStore from 'stores/container'

// import { inject } from 'mobx-react'
import DropdownContent from './DropdownContent'

// import styles from './index.scss'

// @inject('rootStore')
export default class ImageSearch extends Component {
  constructor(props) {
    super(props)
    this.store = new ContainerStore()
    // this.getImageDetail = throttle(this.getImageDetail, 1000)

    this.state = {
      isLoading: false,
      showPortsTips: false,
      value: '',
    }
  }

  static defaultProps = {
    className: '',
    type: 'add',
  }

  static contextTypes = {
    forceUpdate: PropTypes.func,
  }

  get selectedImage() {
    const { formTemplate } = this.props
    const image = get(formTemplate, 'image', '')

    return get(globals.cache, `[${image}]`)
  }

  get tag() {
    const imageName = get(this.props.formTemplate, 'image', '')
    const result = PATTERN_IMAGE_TAG.exec(imageName)
    return get(result, `[${result.length - 1}]`, ':latest').slice(1)
  }

  get urlPath() {
    const { cluster, namespace, workspace } = this.props.rootStore.myClusters
    const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}`
    return PATH
  }

  componentDidMount() {
    // const { formTemplate } = this.props
    // console.log(this.urlPath)
    // const image = get(formTemplate, 'image', '')
    // if (!this.selectedImage && image) {
    //   const secret = get(formTemplate, 'pullSecret')
    //   this.getImageDetail({ image, secret })
    // }
  }

  componentWillUnmount() {
    this.isUnMounted = true
  }

  handleEnter = params => {
    this.props.onChange && this.props.onChange(params)
  }

  render() {
    return (
      <>
        <Form.Item
          label={t('Image')}
          desc={t.html('IMAGE_DESC', {
            link: `/secrets`,
          })}
        >
          <DropdownContent
            {...this.props}
            store={this.store}
            onEnter={this.handleEnter}
            name="image"
            onLoading={this.handleLoadingChange}
          />
        </Form.Item>
        {/* {globals.config.enableImageSearch && this.renderSelectedContent()} */}
      </>
    )
  }
}
