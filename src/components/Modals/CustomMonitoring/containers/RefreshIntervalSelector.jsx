import React from 'react'
import { observer, inject } from 'mobx-react'
import { translateTimeAlias } from 'utils/time'
import { Icon } from '@kube-design/components'

import Select from '../components/DarkThemeSelect'

import { refreshInterval as refreshOpts } from '../options'

@inject('monitoringStore')
@observer
class RefreshIntervalSelector extends React.Component {
  handleChange = value => {
    this.props.monitoringStore.changeRefreshInterval(value)
  }

  options = refreshOpts.map(interval => ({
    label: interval
      ? `${t('Interval')} ${translateTimeAlias(interval)}`
      : t('No Refreshing'),
    value: interval,
  }))

  render() {
    const { monitoringStore } = this.props
    const { refresh } = monitoringStore
    return (
      <Select
        prefixIcon={<Icon name={'refresh'} type={'light'} />}
        onChange={this.handleChange}
        options={this.options}
        value={refresh}
      />
    )
  }
}

export default RefreshIntervalSelector
