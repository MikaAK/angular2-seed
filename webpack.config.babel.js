/* eslint-env es6 */

import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackDashboard from 'webpack-dashboard/plugin'
import {optimize, DllReferencePlugin} from 'webpack'

import {name} from './package.json'
import {
  makeConfig,
  rootPath,
  DEV_SERVER_PORT,
  APP_ROOT,
  PUBLIC_PATH,
  NODE_MODULES_PATH,
  appPath,
  buildPath,
  IS_AOT,
  ENV,
  IS_BUILD_COMMAND,
  CDN_URL,
  BUILD_PATH,
  SHARED_PLUGINS,
  PRE_LOADERS,
  LOADERS,
  ProgressBarPlugin,
  OUTPUT_CONFIG,
  IS_BUILD,
  DEFAULT_CDN
} from './webpack.config.shared'

const {CommonsChunkPlugin} = optimize

const HTML_PLUGIN_CONFIG = {
  inject: false,
  title: name,
  chunksSortMode: 'dependency',
  minify: IS_BUILD ? {caseSensitive: true} : false,
  template: `pug!${appPath('index.pug')}`,
  favicon: rootPath('favicon.ico'),
}

// use when https://github.com/jantimon/favicons-webpack-plugin/issues/29 is fixed
// FaviconsWebpackPlugin(FAVICON_CONFIG),
const FAVICON_CONFIG = {
  logo: 'favicon.png',
  title: name,
  inject: false
}

const ENTRY = {
  vendor: ['./src/polyfills.ts', './src/vendor.ts'],
  app: IS_AOT ? './src/main.aot.ts' : './src/main.ts',
  styles: './src/style/global.scss'
}

if (ENV.__IS_WEBWORKER__) {
  Object.assign(ENTRY, {webworker: './src/main.webworker.ts'})
  Object.assign(HTML_PLUGIN_CONFIG, {
    excludeChunks: ['app']
  })
}

const rules = IS_AOT ? Object.values(LOADERS) : [...Object.values(PRE_LOADERS), ...Object.values(LOADERS)]

const config = makeConfig({
  entry: ENTRY,
  output: OUTPUT_CONFIG,
  dependencies: ['vendor'],

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [NODE_MODULES_PATH, PUBLIC_PATH, APP_ROOT],
    alias: {
      vendor: rootPath('vendor')
    }
  },

  module: {
    rules,
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/]
  },

  plugins: [
    ...SHARED_PLUGINS,
    new HtmlWebpackPlugin(HTML_PLUGIN_CONFIG)
    // new DllReferencePlugin({
    //   manifest: buildPath('build-manifest.json')
    // })
  ],

  devServer: {
    stats: 'minimal',
    port: DEV_SERVER_PORT,
    // Sample Proxy Config
    //proxy: [{
      //path: '/api/*',
      //target: 'http://localhost:4000'
    //}],

    historyApiFallback: true,
    // {
    //   // If you have multiple entrypoints add them here
    //   rewrites: [{
    //     from: /.*/,
    //     to: '/index.html'
    //   }]
    // },

    watchOptions: {
      aggregateTimeout: 300
    }
  }
})

if (IS_BUILD)
  config.plugins.push(
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
  )

if (IS_BUILD_COMMAND || IS_BUILD)
  config.plugins.push(ProgressBarPlugin)
else
  config.plugins.push(new WebpackDashboard({title: name}))

export default config
