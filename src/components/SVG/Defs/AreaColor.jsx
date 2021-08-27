import React from 'react'

import { COLORS_MAP } from 'utils/constants'

export default () => (
  <defs>
    {Object.entries(COLORS_MAP).map(([key, color]) => (
      <linearGradient key={key} id={`${key}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
        <stop offset="95%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    ))}
  </defs>
)
