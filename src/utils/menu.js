import { sortBy } from 'lodash'

export const getTreeData = (data, pid) => {
  const arr = []
  data.forEach(item => {
    if (item.pid === pid) {
      arr.push(item)
      sortBy(arr, 'sort')
      const children = data.filter(o => o.pid === item.id)
      if (children.length > 0) {
        item.children = children
      }
    }
  })
  return arr
}
