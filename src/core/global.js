import { get, uniq, isEmpty, includes, cloneDeep } from 'lodash'
import { safeParseJSON, compareVersion } from 'utils'

/** A global class for authorization check. */
export default class GlobalValue {
  constructor() {
    // local cache
    this._cache_ = {}
  }

  /**
   * Get user's enabled actions of the module
   * @param {String} workspace - workspace name
   * @param {String} project - project name
   * @param {String} module - module name
   * @returns {Array} actions of current module in the project or workspace
   */
  getActions({ cluster, workspace, project, devops, module }) {
    if (globals.config.disableAuthorization) {
      return ['view', 'edit', 'create', 'delete', 'manage']
    }

    const adapter = arr => {
      if (arr.includes('manage')) {
        return uniq([...arr, 'view', 'edit', 'create', 'delete'])
      }
      return arr
    }

    // 项目
    if (project) {
      const defaultActions = get(
        globals.user,
        `projectRules[${cluster}][${project}]._`,
        this.getActions({ cluster, module })
      )
      return adapter([
        ...get(
          globals.user,
          `projectRules[${cluster}][${project}][${module}]`,
          []
        ),
        ...defaultActions,
      ])
    }

    // 流水线
    if (devops) {
      const defaultActions = get(
        globals.user,
        `devopsRules[${cluster}][${devops}]._`,
        []
      )
      return adapter([
        ...get(
          globals.user,
          `devopsRules[${cluster}][${devops}][${module}]`,
          []
        ),
        ...defaultActions,
      ])
    }

    // 工作空间
    if (workspace) {
      const defaultActions = get(
        globals.user,
        `workspaceRules[${workspace}]._`,
        []
      )
      return adapter([
        ...get(globals.user, `workspaceRules[${workspace}][${module}]`, []),
        ...defaultActions,
      ])
    }

    if (cluster) {
      const defaultActions = get(globals.user, `clusterRules[${cluster}]._`, [])
      return adapter([
        ...get(globals.user, `clusterRules[${cluster}][${module}]`, []),
        ...defaultActions,
      ])
    }

    return adapter(get(globals.user, `globalRules[${module}]`, []))
  }

  /**
   * Check if the user has permission to perform the action(s) of the module.
   * @param {String} workspace - workspace name
   * @param {String} project - project name
   * @param {String} module - module name
   * @param {String} action - action name
   * @param {Array} actions - actions name array
   * @returns {Boolean} true or false.
   */
  hasPermission({
    cluster,
    workspace,
    project,
    devops,
    module,
    action,
    actions,
  }) {
    if (globals.config.disableAuthorization) {
      return true
    }

    if (!isEmpty(actions)) {
      return includes(
        this.getActions({ cluster, workspace, project, devops, module }),
        ...actions
      )
    }

    return this.getActions({
      cluster,
      workspace,
      project,
      devops,
      module,
    }).includes(action)
  }

  checkNavItem(item, callback) {
    if (item.multiCluster && !globals.app.isMultiCluster) {
      return false
    }

    if (item.ksModule && !this.hasKSModule(item.ksModule)) {
      return false
    }

    if (
      item.clusterModule &&
      item.clusterModule
        .split('|')
        .every(cm => !this.hasClusterModule(item.cluster, cm))
    ) {
      return false
    }

    if (item.admin && !globals.app.isPlatformAdmin) {
      return false
    }

    if (item.skipAuth) {
      return true
    }

    if (!item._children) {
      item._children = item.children
    }

    if (item._children) {
      item.children = item._children.filter(child => {
        const { cluster } = item
        if (child.tabs) {
          return child.tabs.some(_child => {
            _child.cluster = cluster
            return this.checkNavItem(_child, callback)
          })
        }
        child.cluster = cluster
        return this.checkNavItem(child, callback)
      })

      delete item._children

      return item.children.length > 0
    }

    if (item.authKey && item.authKey.indexOf('|') !== -1) {
      return item.authKey
        .split('|')
        .some(module => callback({ module, action: 'view' }))
    }

    return callback({
      module: item.authKey || item.name,
      action: item.authAction || 'view',
    })
  }

  get enableGlobalNav() {
    const navs = this.getGlobalNavs()
    return navs.length > 0
  }

  getGlobalNavs() {
    if (!this._cache_['globalNavs']) {
      const navs = []

      cloneDeep(globals.config.globalNavs).forEach(nav => {
        if (this.checkNavItem(nav, params => this.hasPermission(params))) {
          navs.push(nav)
        }
      })

      this._cache_['globalNavs'] = navs
    }

    return this._cache_['globalNavs']
  }

  getClusterNavs(cluster) {
    if (!get(globals.user, `clusterRules[${cluster}]`)) {
      return []
    }

    if (!this._cache_[`cluster_${cluster}_navs`]) {
      const navs = []

      cloneDeep(globals.config.clusterNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item => {
          item.cluster = cluster
          return this.checkNavItem(item, params =>
            this.hasPermission({ ...params, cluster })
          )
        })
        if (!isEmpty(filteredItems)) {
          this.checkClusterVersionRequired(filteredItems, cluster)
          navs.push({ ...nav, items: filteredItems })
        }
      })

      this._cache_[`cluster_${cluster}_navs`] = navs
    }

    return this._cache_[`cluster_${cluster}_navs`]
  }

  getAccessNavs() {
    if (!this._cache_['accessNavs']) {
      const navs = []

      cloneDeep(globals.config.accessNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item =>
          this.checkNavItem(item, params => this.hasPermission(params))
        )
        if (!isEmpty(filteredItems)) {
          navs.push({ ...nav, items: filteredItems })
        }
      })

      this._cache_['accessNavs'] = navs
    }

    return this._cache_['accessNavs']
  }

  get workspaces() {
    return globals.user.workspaces || []
  }

  getWorkspaceNavs(workspace) {
    if (!get(globals.user, `workspaceRules[${workspace}]`)) {
      return []
    }

    if (!this._cache_[`workspace_${workspace}_navs`]) {
      const navs = []

      cloneDeep(globals.config.workspaceNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item =>
          this.checkNavItem(item, params =>
            this.hasPermission({ ...params, workspace })
          )
        )

        if (!isEmpty(filteredItems)) {
          navs.push({ ...nav, items: filteredItems })
        }
      })

      this._cache_[`workspace_${workspace}_navs`] = navs
    }

    return this._cache_[`workspace_${workspace}_navs`]
  }

  getManageAppNavs() {
    return globals.config.manageAppNavs
  }

  getProjectNavs({ cluster, workspace, project }) {
    if (!get(globals.user, `projectRules[${cluster}][${project}]`)) {
      return []
    }

    if (!this._cache_[`project_${cluster}_${project}_navs`]) {
      const navs = []

      cloneDeep(globals.config.projectNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item => {
          item.cluster = cluster
          return this.checkNavItem(item, params =>
            this.hasPermission({ ...params, cluster, workspace, project })
          )
        })

        if (!isEmpty(filteredItems)) {
          this.checkClusterVersionRequired(filteredItems, cluster)
          navs.push({ ...nav, items: filteredItems })
        }
      })

      this._cache_[`project_${cluster}_${project}_navs`] = navs
    }

    return this._cache_[`project_${cluster}_${project}_navs`]
  }

  getFederatedProjectNavs() {
    return globals.config.federatedProjectNavs
  }

  getDevOpsNavs({ cluster, workspace, devops }) {
    if (!get(globals.user, `devopsRules[${cluster}][${devops}]`)) {
      return []
    }

    if (!this._cache_[`devops_${cluster}_${devops}_navs`]) {
      const navs = []

      cloneDeep(globals.config.devopsNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item => {
          item.cluster = cluster
          return this.checkNavItem(item, params =>
            this.hasPermission({ ...params, cluster, workspace, devops })
          )
        })

        if (!isEmpty(filteredItems)) {
          this.checkClusterVersionRequired(filteredItems, cluster)
          navs.push({ ...nav, items: filteredItems })
        }

        this._cache_[`devops_${cluster}_${devops}_navs`] = navs
      })
    }

    return this._cache_[`devops_${cluster}_${devops}_navs`]
  }

  getPlatformSettingsNavs() {
    if (!this._cache_['platformSettingsNavs']) {
      const navs = []

      cloneDeep(globals.config.platformSettingsNavs).forEach(nav => {
        const filteredItems = nav.items.filter(item =>
          this.checkNavItem(item, params => this.hasPermission({ ...params }))
        )

        if (!isEmpty(filteredItems)) {
          navs.push({ ...nav, items: filteredItems })
        }
      })

      this._cache_['platformSettingsNavs'] = navs
    }

    return this._cache_['platformSettingsNavs']
  }

  checkClusterVersionRequired(navs, cluster) {
    const ksVersion = this.isMultiCluster
      ? get(globals, `clusterConfig.${cluster}.ksVersion`)
      : get(globals, 'ksConfig.ksVersion')

    navs.forEach(item => {
      if (
        item.requiredClusterVersion &&
        compareVersion(ksVersion, item.requiredClusterVersion) < 0
      ) {
        item.disabled = true
        item.reason = 'CLUSTER_UPGRADE_REQUIRED'
      }

      if (item.children && item.children.length > 0) {
        this.checkClusterVersionRequired(item.children, cluster)
      }
    })
  }

  get enableAppStore() {
    return this.hasKSModule('openpitrix.appstore')
  }

  get isPlatformAdmin() {
    return globals.user.globalrole === 'platform-admin'
  }

  get isMultiCluster() {
    return globals.ksConfig.multicluster
  }

  hasKSModule(module) {
    return get(globals, `ksConfig["${module}"]`)
  }

  hasClusterModule(cluster, module) {
    if (!this.isMultiCluster) {
      return this.hasKSModule(module)
    }
    return get(globals, `clusterConfig.${cluster}["${module}"]`)
  }

  cacheHistory(url, obj) {
    let histories = safeParseJSON(localStorage.getItem('history-cache'), {})
    histories = histories[globals.user.username] || []
    histories = histories.filter(item => item.url !== url)
    localStorage.setItem(
      'history-cache',
      JSON.stringify({
        [globals.user.username]: [{ url, ...obj }, ...histories].slice(0, 8),
      })
    )
  }
}
