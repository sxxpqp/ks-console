import { isArray, isEmpty } from 'lodash'
import { toJS } from 'mobx'
import React from 'react'

import StepCard from './StepCard'

const StepContainer = ({ zIndex, listType, steps }) => {
  const stepsJson = toJS(steps)
  return (
    <>
      {!isEmpty(stepsJson) &&
        isArray(stepsJson) &&
        stepsJson.map((step, index) => (
          <StepCard
            key={JSON.stringify(toJS(step.name)) + index}
            step={toJS(step)}
            index={index}
            zIndex={zIndex}
            listType={listType}
            isLast={stepsJson.length - 1 === index}
          />
        ))}
    </>
  )
}

export default StepContainer
