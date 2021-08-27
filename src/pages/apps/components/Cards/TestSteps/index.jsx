import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import VersionStore from 'stores/openpitrix/version'
import FileStore from 'stores/openpitrix/file'
import { getDocsUrl } from 'utils'

import styles from './index.scss'

@observer
export default class TestSteps extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    appId: PropTypes.string,
    appName: PropTypes.string,
  }

  static defaultProps = {
    detail: {},
    appId: '',
    appName: '',
  }

  constructor(props) {
    super(props)

    this.state = {}

    this.store = new VersionStore()
    this.fileStore = new FileStore()
  }

  render() {
    return (
      <div className={styles.main}>
        <p className={styles.note}>{t('VERSION_SUBMIT_NOTE')}：</p>
        <div className={styles.steps}>
          {t.html('VERSION_SUBMIT_TEST_STEPS')}
        </div>
        <p>
          {t('VERSION_SUBMIT_DOC')}
          <a
            href={getDocsUrl('helm_developer_guide')}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('Develop and test guide')}
          </a>
        </p>
      </div>
    )
  }
}
