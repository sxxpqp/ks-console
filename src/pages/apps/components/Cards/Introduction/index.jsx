import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import Markdown from 'components/Base/Markdown'
import FileStore from 'stores/openpitrix/file'

import styles from './index.scss'

@observer
export default class Introduction extends React.Component {
  static propTypes = {
    versionId: PropTypes.string,
  }

  static defaultProps = {
    versionId: '',
  }

  constructor(props) {
    super(props)

    this.fileStore = new FileStore()
  }

  get files() {
    return this.fileStore.files
  }

  fetchFile() {
    this.fileStore.fetch({ version_id: this.props.versionId })
  }

  componentDidMount() {
    this.fetchFile()
  }

  render() {
    const files = this.fileStore.files

    const readme = files['README.md']
    if (readme || this.appFileStore.isLoading) {
      return (
        <Markdown source={files['README.md']} className={styles.markdown} />
      )
    }

    return <p>{t('The app has no documentation.')}</p>
  }
}
