const fs = require('fs')
const path = require('path')
const RawSource = require('webpack-sources/lib/RawSource')

const isDev = process.env.NODE_ENV === 'development'

class LocalePlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('LocalePlugin', compilation => {
      const assets = compilation.getAssets()
      assets.forEach(asset => {
        let content = asset.source.source()
        try {
          const obj = eval(content)
          if (obj.default) {
            content = JSON.stringify(
              obj.default.reduce((prev, cur) => ({ ...prev, ...cur }), {})
            )
          }

          if (isDev) {
            if (!fs.existsSync(compiler.outputPath)) {
              fs.mkdirSync(compiler.outputPath)
            }
            fs.writeFileSync(
              path.join(compiler.outputPath, asset.name),
              content
            )
          }
        } catch (error) {}

        compilation.updateAsset(asset.name, new RawSource(content))
      })
    })
  }
}

module.exports = LocalePlugin
