import React from 'react'
import moment from 'moment-mini'

export default class Color extends React.Component {
  state = {
    time: Date.now(),
  }

  componentDidMount() {
    this.updateTime()
  }

  updateTime() {
    this.timer = setTimeout(() => {
      this.setState({ time: Date.now() })
      this.updateTime()
    }, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <>
        {t('Time')}: {moment(this.state.time).format('YYYY-MM-DD HH:mm:ss')}
      </>
    )
  }
}
