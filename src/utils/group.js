export const formatTreeData = (treeData, rootName) => {
  return treeData
    .map(item => {
      const parent = item
      parent.children = []
      parent.path = [rootName, parent.group_name]
      parent.parent_id = item.parent_id || 'root'
      treeData.forEach(children => {
        if (parent.group_id === children.parent_id) {
          children.parent_name = parent.group_name
          children.path = [...parent.path, children.group_name]
          parent.children = [...parent.children, children]
        }
      })
      if (parent.parent_id === 'root') {
        parent.parent_name = rootName
        return parent
      }

      return null
    })
    .filter(item => item)
}

export const flattenTreeData = treeData => {
  const treeMap = {}

  const walk = data => {
    if (data.group_id) {
      treeMap[data.group_id] = data
    }

    if (data.children.length > 0) {
      return data.children.map(item => walk(item))
    }
  }

  treeData.map(walk)

  return treeMap
}

export const getBreadCrumbData = (id, rowtreeData) => {
  const data = []
  let currentNode = rowtreeData[id]
  while (currentNode) {
    data.unshift(currentNode)
    currentNode = rowtreeData[currentNode.parent_id]
  }
  return data
}
