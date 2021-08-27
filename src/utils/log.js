import { isString } from 'lodash'

const RESERVED_WORDS_IN_EXP = /[|\\{}()[\]^$+*?.]/g

export function mark(
  originText = '',
  queryText = '',
  markLabel = 'hightLighted'
) {
  if (!isString(originText)) {
    return originText
  }
  if (!queryText) {
    return [originText]
  }

  const regexpString = queryText.replace(RESERVED_WORDS_IN_EXP, '\\$&')
  const reg = new RegExp(regexpString, 'ig')

  return markStrAsArray(originText, reg, markLabel)
}

export function markAll(originText = '', queryList = [], handler = mark) {
  if (!queryList.length) {
    return [originText]
  }

  return queryList.reduce(
    (markedResult, query) =>
      markedResult.reduce(
        (pre, result) => pre.concat(handler(result, query)),
        []
      ),
    [originText]
  )
}

const CN_REGEX = /[\u4e00-\u9fa5]/

export function esMark(
  originText = '',
  queryText = '',
  markLabel = 'hightLighted'
) {
  if (!isString(originText)) {
    return originText
  }

  const words = queryText.match(/\w+|[\u4e00-\u9fa5]/g) || []

  const regexpString = words.reduce((pre, cur) => {
    const lastString = pre.slice(-1)
    const isChineseWord = CN_REGEX.test(cur)
    const foreStringIsChinese = CN_REGEX.test(lastString)

    return `${pre}[^\\w\\u4e00-\\u9fa5]{${
      isChineseWord || foreStringIsChinese ? 0 : 1
    },}${cur}`
  }, '')

  if (!regexpString) {
    return [originText]
  }

  const reg = new RegExp(regexpString, 'ig')

  return markStrAsArray(originText, reg, markLabel)
}

export function markStrAsArray(originText, reg, markLabel = 'hightLighted') {
  const markedText = [originText]

  let lastMatchIndex = 0

  originText.replace(reg, (match, index) => {
    const lastIndex = markedText.length - 1
    const uncheckedText = markedText[lastIndex]
    const uncheckedMatchIndex = index - lastMatchIndex

    const textBeforeMatch = uncheckedText.slice(0, uncheckedMatchIndex)
    const textAfterMatch = uncheckedText.slice(
      uncheckedMatchIndex + match.length
    )

    markedText[lastIndex] = textBeforeMatch
    markedText.push({ [markLabel]: match }, textAfterMatch)
    lastMatchIndex += index + match.length
  })

  return markedText
}
