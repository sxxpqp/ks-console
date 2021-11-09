// 把list转嵌套列表
export const list2Tree = (lists, pid = -1) => {
  const arr = []
  lists.forEach(item => {
    item.key = item.id
    if (item.pid === pid) {
      arr.push(item)
      const children = list2Tree(lists, item.id)
      if (children.length > 0) {
        item.children = children
      }
    }
  })
  return arr
}

// 过滤树形组件
export const getExpanedKeys = (tree, name) => {
  const arr = []
  tree.forEach(item => {
    if (item.name.indexOf(name) > -1) {
      arr.push(item.pid)
      if (item.pid !== -1) {
        arr.push(...getPids(tree, item.pid))
      }
    }
    if (item.children && item.children.length > 0) {
      arr.push(...getExpanedKeys(item.children, name))
    }
  })
  return arr
}

// 获取所有父级id
export const getPids = (tree, id) => {
  const arr = []
  tree.forEach(item => {
    if (!item) return
    item.parent = tree
    if (item.id === id) {
      arr.push(item.pid)
      if (item.pid !== -1) {
        arr.push(...getPids(item.parent, item.pid))
      }
    } else if (item.children && item.children.length > 0) {
      arr.push(...getPids(item.children, id))
    }
  })
  return arr
}
