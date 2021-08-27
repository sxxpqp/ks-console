import React from 'react'
import { isString, get, pick } from 'lodash'
import { groovyToJS } from 'utils/devops'

import style from './index.scss'

const getValue = arg => {
  if (get(arg, 'value.value') !== undefined) {
    return typeof arg.value.value === 'string'
      ? arg.value.value
      : JSON.stringify(arg.value.value)
  }
  return typeof arg.value === 'string' ? arg.value : JSON.stringify(arg.value)
}

const defaultRender = arg => (
  <div key={arg.key} className={style.content__detail}>
    {t(arg.key)} &nbsp;&nbsp;
    {getValue(arg)}
  </div>
)

const gitRender = arg => {
  if (arg.key === 'changelog' || arg.key === 'poll') {
    return null
  }
  return defaultRender(arg)
}

const groovyRender = obj =>
  Object.entries(obj).map(_arg => (
    <div key={_arg[0]} className={style.content__detail}>
      {t(_arg[0])} &nbsp;&nbsp;
      {_arg[1]}
    </div>
  ))

const withCredentialsRender = arg => {
  const value = getValue(arg)
  if (isString(value) && value.startsWith('${')) {
    const obj = groovyToJS(value)
    return groovyRender(obj)
  }
  return defaultRender(arg)
}

const checkoutRender = arg => {
  if (arg.key === 'scm') {
    const value = getValue(arg)

    if (isString(value) && value.startsWith('[')) {
      let obj = groovyToJS(value)
      obj = pick(obj, ['remote', 'credentialsId'])
      return groovyRender(obj)
    }
    return defaultRender(arg)
  }
  return null
}

const stepsRender = {
  git: gitRender,
  withCredentials: withCredentialsRender,
  checkout: checkoutRender,
  default: defaultRender,
}

export const renderStepArgs = step => {
  if (!step.arguments) return null

  if (step.arguments.length !== undefined) {
    return step.arguments.map(argument => {
      if (stepsRender[step.name]) {
        return stepsRender[step.name](argument)
      }
      return stepsRender.default(argument)
    })
  }

  if (stepsRender[step.name]) {
    return stepsRender[step.name](step.arguments)
  }
  return stepsRender.default(step.arguments)
}
