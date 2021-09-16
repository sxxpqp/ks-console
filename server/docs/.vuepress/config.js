const nav = []

const sidebar = {
  '/': [
    {
      title: '首页',
      collapsable: false,
      children: [''],
    },
  ],
}

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@static': resolve('./static'),
  //     },
  //   },
  // },
  base: isDev ? '/' : '/doc',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '说明文档',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: '人工智能容器管理平台说明文档',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: nav,
    sidebar: sidebar,
    search: false,
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    // '@vuepress/plugin-back-to-top',
    // // '@vuepress/plugin-medium-zoom',
    // 'photo-swipe',
    // '@vuepress/nprogress',
    // 'vuepress-plugin-smooth-scroll',
    // require('./utils/plugins.js'),
    // [
    //   'sitemap',
    //   {
    //     hostname: 'https://front-end.toimc.com/notes-page/',
    //   },
    // ],
    // '@snowdog/vuepress-plugin-pdf-export'
  ],
}
