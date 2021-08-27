import React, { Component } from 'react'
import classnames from 'classnames'

import { Modal } from 'components/Base'
import { Icon } from '@kube-design/components'

import FormGroupCard from '../FormGroupCard'
import styles from './index.scss'

export default class GraphTypeSelectModal extends Component {
  state = {
    type: 'line',
  }

  /**
   * @TODO: move in config file
   */
  typeConfig = {
    line: {
      icon: 'linechart',
      name: t('LINE_CHART'),
      desc: [
        {
          title: t('APPLICABLE_SCENE'),
          description: t('LINE_CHART_DESC'),
        },
        {
          title: t('BASE_LINE_CHART'),
          description: t('BASE_LINE_CHART_DESC'),
        },
        {
          title: t('STACK_LINE_CHART'),
          description: t('STACK_LINE_CHART_DESC'),
        },
      ],
    },
    bar: {
      icon: 'barchart',
      name: t('BAR_CHART'),
      desc: [
        {
          title: t('APPLICABLE_SCENE'),
          description: t('BAR_CHART_DESC'),
        },
        {
          title: t('BASE_BAR_CHART'),
          description: t('BASE_BAR_CHART_DESC'),
        },
        {
          title: t('STACK_BAR_CHART'),
          description: t('STACK_BAR_CHART_DESC'),
        },
      ],
    },
  }

  handleClick = e => {
    this.setState({ type: e.currentTarget.dataset.type })
  }

  onOk = () => {
    this.props.onOk(this.state.type)
  }

  render() {
    const { visible, onCancel } = this.props
    const { type } = this.state

    const config = this.typeConfig[type]

    return (
      <Modal
        width={960}
        imageIcon={'/assets/coin.svg'}
        title={t('SELECT_CHART_TYPE')}
        description={t('SELECT_CHART_TYPE_MODAL_DESC')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onOk}
      >
        <div className={styles.wrapper}>
          <FormGroupCard label={t('CHART_TYPES')}>
            {Object.entries(this.typeConfig).map(([key, message]) => (
              <div
                key={key}
                data-type={key}
                onClick={this.handleClick}
                className={styles.typeOpts}
              >
                <div
                  className={classnames(styles.typeOpt, {
                    [styles.select]: key === type,
                  })}
                >
                  <Icon
                    className={styles.icon}
                    name={message.icon}
                    size={40}
                    type={key === type ? 'light' : 'dark'}
                  />
                  <h4>{message.name}</h4>
                </div>
              </div>
            ))}
          </FormGroupCard>

          {config.desc.map(des => (
            <div key={des.title}>
              <h3>{des.title}</h3>
              <p>{des.description}</p>
            </div>
          ))}
          <FormGroupCard label={t('DISPLAY_POSITION')}>
            <div className={styles.position}>
              <div className={styles.navs}>
                <div />
                <div />
              </div>
              <div className={styles.placeholderWrapper}>
                <div className={styles.placeholder}>
                  <div className="text-center">
                    <Icon name={config.icon} size={40} />
                    <div className="margin-t12">
                      {t('EMPTY_CHART_PLACEHOLDER')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormGroupCard>
        </div>
      </Modal>
    )
  }
}
