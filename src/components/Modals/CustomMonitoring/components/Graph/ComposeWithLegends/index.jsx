import React from 'react'
import classnames from 'classnames'
import Chart from '../Compose'

import styles from './index.scss'

export default class LegendsManageChart extends React.Component {
  state = {
    legendsVisibleStates: this.props.legends.reduce(
      (state, legend) => ({ ...state, [legend.ID]: true }),
      {}
    ),
  }

  handleClick = e => {
    const { id } = e.currentTarget.dataset
    const { legendsVisibleStates } = this.state

    this.setState({
      legendsVisibleStates: {
        ...legendsVisibleStates,
        [id]: !legendsVisibleStates[id],
      },
    })
  }

  render() {
    const { legends, ...restProps } = this.props
    const { legendsVisibleStates } = this.state

    return (
      <div className={styles.wrapper}>
        <Chart
          {...restProps}
          legends={legends.filter(legend => legendsVisibleStates[legend.ID])}
        />

        <div>
          {legends.map(legend => (
            <span
              className={classnames(styles.legend, {
                [styles.hidden]: !legendsVisibleStates[legend.ID],
              })}
              key={legend.ID}
              data-id={legend.ID}
              onClick={this.handleClick}
            >
              <small
                className={styles.radios}
                style={{ backgroundColor: legend.color }}
              />
              <span>{legend.name}</span>
            </span>
          ))}
        </div>
      </div>
    )
  }
}
