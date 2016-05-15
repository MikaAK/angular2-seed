/* eslint-env es6 */

import _ from 'lodash'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ProgressBar from 'progress'
import S3Plugin from 'webpack-s3-plugin'
import CompressionPlugin from 'compression-webpack-plugin' 
import {vendor} from './vendors.json'
import {name} from './package.json'

const {
  CommonsChunkPlugin,
  DedupePlugin,
  OccurenceOrderPlugin,
  LimitChunkCountPlugin,
  MinChunkSizePlugin,
  UglifyJsPlugin
} = webpack.optimize

const {DefinePlugin, ProgressPlugin} = webpack,
      CONTEXT = path.resolve(__dirname),
      createPath = (nPath) => path.resolve(CONTEXT, nPath),
      DEV_SERVER_PORT = 4000,
      APP_ROOT = createPath('src'),
      PUBLIC_PATH = createPath('public'),
      createAppPath = (nPath) => path.resolve(APP_ROOT, nPath),
      {NODE_ENV, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET, CDN_URL} = process.env,
      BUILD_PATH = createPath('build')

const progressBar = new ProgressBar(':bar [:current/:total](:percent) - :elapsed', {
  complete: '=',
  incomplete: ' ',
  total: 100
})

var devtool

const TS_INGORES = [
  2403,
  2300,
  2374,
  2375,
  1005
]

const ENV = {
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging'
}

const IS_BUILD = ENV.__STAGING__ || ENV.__PROD__,
      DEFAULT_CDN = CDN_URL || `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`,
      SASS_LOADER = `${IS_BUILD ? 'postcss!' : ''}sass?sourceMap`

Object.assign(ENV, {__IS_BUILD__: IS_BUILD})

var preLoaders = {
  tslint: {
    test: /\.ts/,
    loader: 'tslint',
    exclude: [createPath('node_modules')],
    include: [APP_ROOT]
  }
}

var loaders = {
  javascript: {
    test: /\.ts/,
    loader: `babel!ts?${TS_INGORES.map(num => `ignoreDiagnostics[]=${num}`).join('&')}`,
    exclude: [createPath('node_modules')],
    include: [APP_ROOT]
  },

  html: {
    test: /\.jade/,
    loader: 'jade',
    include: [APP_ROOT]
  },

  globalCss: {
    test: /\.s?css/,
    loader: `style!css?sourceMap!${SASS_LOADER}`,
    include: [createAppPath('style')]
  },

  // For to-string removes the ability to cache css so we use raw in development
  componentCss: {
    test: /\.s?css/,
    loader: `${IS_BUILD ? 'to-string' : 'raw'}!${SASS_LOADER}`,
    exclude: [createAppPath('style')]
  },

  json: {
    test: /\.json/,
    loader: 'json'
  },

  file: {
    test: /\.(png|gif|jpg|jpeg)$/,
    loader: `file${IS_BUILD ? '?name=[hash].[ext]' : ''}!image-webpack?bypassOnDebug`,
    include: [createPath('public/img')]
  },

  svg: {
    test: /\.svg/,
    loader: 'image-webpack?bypassOnDebug!svg-inline',
    include: [createPath('public/svg')]
  }
}

if (ENV.__PROD__)
  devtool = false
else if (ENV.__DEV__)
  devtool = '#source-map'
else if (ENV.__STAGING__ || ENV.__TEST__)
  devtool = '#inline-source-map'

var config = {
  context: CONTEXT,
  devtool,
  debug: !ENV.__PROD__ && !ENV.__STAGING__,

  entry: {
    vendor,
    app: './src/boot.ts'
  },

  output: {
    path: BUILD_PATH,
    publicPath: IS_BUILD ? DEFAULT_CDN : '',
    filename: IS_BUILD ? '[name]-[chunkhash].js' : '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: IS_BUILD ? '[id].chunk-[chunkhash].js': '[id].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json'],
    root: [APP_ROOT, PUBLIC_PATH],
    alias: {
      vendor: createPath('vendor')
    }
  },

  module: {
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    preLoaders: Object.values(preLoaders),
    loaders: Object.values(loaders)
  },

  plugins: [
    new DefinePlugin(ENV),
    new ProgressPlugin(percentage => progressBar.update(percentage)),
    new HtmlWebpackPlugin({
      title: name,
      minify: IS_BUILD ? {caseSensitive: true} : false,
      template: createAppPath('index.jade'),
      favicon: path.resolve(__dirname, 'favicon.ico')
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false
  },

  postcss() {
    return [autoprefixer]
  },

  devServer: {
    stats: 'minimal',
    port: DEV_SERVER_PORT,
    // Sample Proxy Config
    //proxy: [{
      //path: '/api/*',
      //target: 'http://localhost:4000'
    //}],

    historyApiFallback: {
      // If you have multiple entrypoints add them here
      rewrites: [{
        from: /.*/,
        to: '/index.html'
      }]
    },

    watchOptions: {
      aggregateTimeout: 300
    }
  }
}

if (!ENV.__TEST__)
  config.plugins.push(
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: IS_BUILD ? 'vendor-[chunkhash].js' : 'vendor.js',
      minChunks: Infinity
    }),

    new CommonsChunkPlugin({
      name: 'common',
      filename: IS_BUILD ? 'common-[chunkhash].js' : 'common.js',
      minChunks: 2,
      chunks: ['app', 'vendor']
    })
  )

if (ENV.__DEV__) {
  var WebpackNotifierPlugin = require('webpack-notifier')

  config.plugins.push(new WebpackNotifierPlugin({
    title: name,
    contentImage: createPath('./favicon.ico')
  }))
} else if (IS_BUILD) {
  loaders.globalCss.loader = ExtractTextPlugin.extract('style', loaders.globalCss.loader.replace('style', ''))

  config.plugins.push(
    new OccurenceOrderPlugin(),
    new DedupePlugin(),
    new ExtractTextPlugin('[name]-[chunkhash].css'),
    new LimitChunkCountPlugin({maxChunks: 15}),
    new MinChunkSizePlugin({minChunkSize: 10000}),
    new UglifyJsPlugin({mangle: false})
  )
} else if (ENV.__TEST__) {
  config.resolve.cache = false
  config.stats = {
    colors: true,
    reasons: true
  }

  config.node = _.extend(config.node, {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  })

  config.module.noParse = [
    /zone\.js\/dist\/zone-microtask\.js/,
    /zone\.js\/dist\/long-stack-trace-zone\.js/,
    /zone\.js\/dist\/jasmine-patch\.js/
  ]
}

if (ENV.__PROD__)
  config.plugins.push(
    new CompressionPlugin({
      asset: '[path]',
      algorithm: 'gzip',
      minRatio: 0.8
    }),

    new S3Plugin({
      exclude: /.*\.html$/,
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION
      },
      s3UploadOptions: {
        Bucket: AWS_BUCKET,
        CacheControl: 'max-age=315360000, no-transform, public',
        ContentEncoding: 'gzip'
      },
      cdnizerOptions: {
        defaultCDNBase: DEFAULT_CDN
      }
    }),

    new S3Plugin({
      directory: BUILD_PATH,
      basePath: 'public/',
      exclude: /\.svg$/,
      include: loaders.file.test,
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION

      },
      s3UploadOptions: {
        Bucket: AWS_BUCKET,
        CacheControl: 'max-age=315360000, no-transform, public'
      }
    })
  )
else
  vendor.push('zone.js/dist/long-stack-trace-zone')

module.exports = config
