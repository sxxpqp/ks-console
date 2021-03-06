// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
const context = require.context('./', false, /\.js$/)
const keys = context.keys().filter(item => item !== './index.js')

const models = {}
for (let i = 0; i < keys.length; i += 1) {
  Object.assign(models, context(keys[i]).default)
}

export default models
