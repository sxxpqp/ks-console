import React from 'react'
import { get, isEmpty, pick } from 'lodash'
// import classnames from 'classnames'
// import { Icon, InputSearch, Loading } from '@kube-design/components'
import Select from './Select'
import Input from './Input'

import styles from './index.scss'

export default class DropdownContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dockerList: [],
      visible: false,
      isLoading: false,
      secretValue: '',
      dockerHub: '',
      image: '',
    }
    this.store = props.store
    this.dropContentRef = React.createRef()
  }

  static defaultProps = {
    imageRegistries: [],
    className: '',
    value: '',
    onChange: () => {},
  }

  // get secretValue() {
  //   const { formTemplate } = this.props
  //   return get(formTemplate, 'pullSecret', '')
  // }

  get registryUrl() {
    const { imageRegistries } = this.props
    if (!isEmpty(imageRegistries) && this.secretValue) {
      const selectedSecret = imageRegistries.find(
        item => item.value === this.secretValue
      )

      let url = get(selectedSecret, 'url', '')
      if (url) {
        // remove url scheme
        url = url.replace(/^(http(s)?:\/\/)?(.*)$/, '$3')
        return url
      }
    }

    return ''
  }

  get imageName() {
    const { value } = this.props

    if (value.startsWith(this.registryUrl)) {
      const reg = new RegExp(`${this.registryUrl}(/)?`)
      return value.replace(reg, '')
    }
    return value
  }

  get secretsOptions() {
    const { imageRegistries } = this.props

    const options = imageRegistries.map(item => ({
      label: `${item.url} (${item.value})`,
      value: item.value,
      url: item.url,
    }))
    return [{ label: `DockerHub`, value: '', url: '' }, ...options]
  }

  componentDidMount() {
    // console.log(this.props)
  }

  componentWillUnmount() {
    this.isUnMounted = true
    document.removeEventListener('click', this.handleDOMClick)
  }

  handleDOMClick = e => {
    if (
      this.dropContentRef &&
      this.dropContentRef.current &&
      !this.dropContentRef.current.contains(e.target)
    ) {
      this.hideContent()
    }
  }

  hideContent = () => {
    this.setState({ visible: false }, () => {
      document.removeEventListener('click', this.handleDOMClick)
    })
  }

  handleSecretChange = value => {
    const dockerHub = this.secretsOptions.filter(
      item => item.value === value
    )[0].url
    this.setState({
      secretValue: value,
      dockerHub,
    })
  }

  handleInputChange = (e, value) => {
    this.setState({
      image: value,
    })
  }

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      this.handleConfirm()
    }
  }

  handleConfirm = () => {
    const props = pick(this.state, ['dockerHub', 'image'])
    this.props.onEnter(props)
  }

  render() {
    const { secretValue, image } = this.state
    return (
      <>
        <Input
          className={styles.imageInput}
          onChange={this.handleInputChange}
          value={image}
          autoComplete="off"
          placeholder="固化镜像名称，请直接输入名称 例：nginx:latest"
          onBlur={this.handleConfirm}
          onKeyUp={this.handleKeyUp}
        >
          <Select
            value={secretValue}
            className={styles.secretSelect}
            options={this.secretsOptions}
            onChange={this.handleSecretChange}
            disabled={this.secretsOptions.length <= 1}
          />
        </Input>
      </>
    )
  }
}
