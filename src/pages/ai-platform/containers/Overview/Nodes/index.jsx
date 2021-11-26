import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Row, Button } from 'antd'
import ReactECharts from 'echarts-for-react'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'

@observer
@inject('rootStore')
export default class NodesOverview extends Component {
  constructor(props) {
    super(props)

    this.store = this.props.groupStore
    this.echartRef = React.createRef()

    this.labelOption = {
      show: true,
      position: 'top',
      distance: 15,
      align: 'center',
      verticalAlign: 'middle',
      rotate: 0,
      formatter({ seriesName, value }) {
        const targetMap = {
          cpu_used: 'C',
          mem_used: 'Gi',
          disk_used: 'G',
          gpu_used: 'C',
        }
        return `${value}${targetMap[seriesName]}`
      },
      fontSize: 13,
      rich: {
        name: {},
      },
    }
  }

  componentDidMount() {
    const echartInstance = this.echartRef.getEchartsInstance()
    window.addEventListener('resize', echartInstance.resize)
    setTimeout(() => {
      echartInstance.resize()
    }, 200)
  }

  getOptions() {
    const { nodes } = this.store
    const tmp = nodes.slice(0, 5)

    const xAxis = [
      {
        type: 'category',
        axisTick: { show: false },
        data: tmp.map(i => i.name),
      },
    ]

    const keys = ['cpu_used', 'mem_used', 'disk_used', 'gpu_used']

    const series = keys.map(key => ({
      name: key,
      type: 'bar',
      label: this.labelOption,
      emphasis: {
        focus: 'series',
      },
      data: tmp.map(i => parseFloat(i[key], 10)),
    }))

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: keys,
        formatter(name) {
          const targetMap = {
            cpu_used: 'CPU',
            mem_used: '内存',
            disk_used: '磁盘',
            gpu_used: 'GPU',
          }
          return targetMap[name]
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          // mark: { show: true },
          // dataView: { show: true, readOnly: false },
          // magicType: { show: true, type: ['line', 'bar', 'stack'] },
          // restore: { show: true },
          // saveAsImage: { show: true },
        },
      },
      xAxis,
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    }
  }

  finished() {
    // this.echartRef.resize && this.echartRef.resize()
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 115 ~ NodesOverview ~ finished ~ this.echartRef',
    //   this.echartRef
    // )
  }

  // rendered() {
  //   // this.echartRef.resize && this.echartRef.resize()
  // }

  // 节点统计
  render() {
    const onEvents = {
      finished: this.finished,
      // rendered: this.rendered,
    }
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    const url = `/${workspace}/clusters/${cluster}/projects/${namespace}/nodes`
    return (
      <Panel title="节点资源统计" id="panel">
        <ReactECharts
          ref={e => {
            this.echartRef = e
          }}
          option={this.getOptions()}
          style={{ width: '100%' }}
          onEvents={onEvents}
        />
        <Row justify="end">
          <Link to={url}>
            <Button type="link">查看更多</Button>
          </Link>
        </Row>
      </Panel>
    )
  }
}
