import React from 'react'

import AreaColorDefs from './Defs/AreaColor'

class GlobalSVG extends React.PureComponent {
  render() {
    const style = {
      position: 'absolute',
      width: 0,
      height: 0,
      overflow: 'hidden',
    }

    return (
      <svg
        id="Global_SVG"
        aria-hidden={true}
        style={style}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <AreaColorDefs />
      </svg>
    )
  }
}

export default GlobalSVG
