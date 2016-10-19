// Not ready yet for use, issue with webpack split

import {DllPlugin} from 'webpack'

import {
  ENV,
  DEV_SERVER_PORT,
  CONTEXT,
  LOADERS,
  buildPath,
  makeConfig,
  IS_BUILD,
  BUILD_PATH,
  PRE_LOADERS,
  OUTPUT_CONFIG,
  SHARED_PLUGINS,
  ProgressBarPlugin
} from './webpack.config.shared'

const config = makeConfig({
  name: 'vendor',
  context: CONTEXT,

  entry: [
    './src/polyfills.ts',
    './src/vendor.ts'
  ],

  output: Object.assign({}, OUTPUT_CONFIG, {
    filename: IS_BUILD ? 'vendor-[chunkhash].js' : 'vendor.js',
   sourceMapFilename: 'vendor.map',
    library: 'vendor_[hash]'
  }),

  module: {
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    rules: Object.values(PRE_LOADERS)
      .concat(Object.values(LOADERS))
  },

  plugins: [
    ...SHARED_PLUGINS,
    ProgressBarPlugin,
    new DllPlugin({
      name: 'vendor_[hash]',
      path: buildPath('build-manifest.json')
    })
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

if (!ENV.__PROD__)
  config.entry.push('zone.js/dist/long-stack-trace-zone')

export default config
