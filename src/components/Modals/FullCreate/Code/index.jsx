import React from 'react'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'
import { Icon } from '@kube-design/components'

import EditMode from 'components/EditMode'

import styles from './index.scss'

export default class CodeMode extends React.Component {
  static propTypes = {
    formTemplate: PropTypes.object,
    onOk: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    onOk() {},
    isSubmitting: false,
  }

  constructor(props) {
    super(props)

    this.data = cloneDeep(props.formTemplate)

    this.editor = React.createRef()
  }

  getData() {
    return this.editor.current.getData()
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Edit Mode')}</div>
          <p>{t('CREATE_BY_YAML_DESC')}</p>
        </div>
        <div className={styles.codeWrapper}>
          <div className={styles.pane}>
            <div className={styles.title}>
              <Icon name="coding" size={20} />
              <span>{t('Edit YAML')}</span>
            </div>
            <EditMode
              ref={this.editor}
              className={styles.editor}
              value={this.data}
            />
          </div>
        </div>
      </div>
    )
  }
}
