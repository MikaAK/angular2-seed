/* eslint-env es6 */

import _ from 'lodash'
import path from 'path'
import ProgressBar from 'progress'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import S3Plugin from 'webpack-s3-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import V8LazyParsePlugin from 'v8-lazy-parse-webpack-plugin'
import WebpackDashboard from 'webpack-dashboard/plugin'
import {ForkCheckerPlugin} from 'awesome-typescript-loader'
import {AotPlugin} from '@ngtools/webpack'
import {
  optimize,
  ContextReplacementPlugin,
  DefinePlugin,
  ProgressPlugin,
  LoaderOptionsPlugin
} from 'webpack'

import {vendor} from './vendors.json'
import {name} from './package.json'

const {
  CommonsChunkPlugin,
  DedupePlugin,
  OccurenceOrderPlugin,
  LimitChunkCountPlugin,
  MinChunkSizePlugin,
  UglifyJsPlugin
} = optimize

const CONTEXT = path.resolve(__dirname),
      rootPath = (nPath) => path.resolve(CONTEXT, nPath),
      DEV_SERVER_PORT = 4000,
      APP_ROOT = rootPath('src'),
      PUBLIC_PATH = rootPath('public'),
      NODE_MODULES_PATH = rootPath('node_modules'),
      appPath = (nPath) => path.resolve(APP_ROOT, nPath),
      {IS_AOT, NODE_ENV, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET, CDN_URL} = process.env,
      BUILD_PATH = rootPath('build'),
      buildPath = (nPath) => path.resolve(BUILD_PATH, nPath),
      IS_WEBWORKER = false

const progressBar = new ProgressBar('[:bar] :percent (:current/:total)', {
  complete: '-',
  incomplete: ' ',
  total: 100
})

var devtool

const HTML_PLUGIN_CONFIG = {
  inject: false,
  title: name,
  chunksSortMode: 'dependency',
  minify: IS_BUILD ? {caseSensitive: true} : false,
  template: `pug!${appPath('index.pug')}`,
  favicon: path.resolve(__dirname, 'favicon.ico'),
}

// use when https://github.com/jantimon/favicons-webpack-plugin/issues/29 is fixed
// FaviconsWebpackPlugin(FAVICON_CONFIG),
const FAVICON_CONFIG = {
  logo: 'favicon.png',
  title: name,
  inject: false
}

const ENTRY = {
  vendor,
  app: './src/main.ts',
  styles: './src/style/global.scss'
}

const ENV = {
  __AOT__: IS_AOT,
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging',
  __IS_WEBWORKER__: IS_WEBWORKER
}

const IS_BUILD = ENV.__STAGING__ || ENV.__PROD__,
      DEFAULT_CDN = CDN_URL || `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`,
      SASS_LOADER = `${IS_BUILD ? 'postcss!' : ''}sass?sourceMap`

Object.assign(ENV, {__IS_BUILD__: IS_BUILD})

if (ENV.__IS_WEBWORKER__) {
  Object.assign(ENTRY, {webworker: './src/main.webworker.ts'})
  Object.assign(HTML_PLUGIN_CONFIG, {
    excludeChunks: ['app']
  })
}

var preLoaders = {
  tslint: {
    test: /\.ts$/,
    loader: 'tslint',
    exclude: [NODE_MODULES_PATH],
    include: [APP_ROOT]
  },

  systemJS: {
    test: /\.routes\.ts$/,
    loader: 'string-replace',
    query: {
      search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
      replace: '$1.import($3).then(mod => mod.default)',
      flags: 'g'
    },
    include: [appPath('app'), appPath('shared')]
  }
}

var loaders = {
  javascript: {
    test: /\.ts$/,
    loader: [
      'babel',
      'awesome-typescript',
      'angular2-template',
      `@angularclass/hmr-loader?pretty=${!IS_BUILD}&prod=${IS_BUILD}`
    ],
    exclude: [NODE_MODULES_PATH],
    include: [APP_ROOT]
  },

  html: {
    test: /\.pug/,
    loader: ['apply', 'pug'],
    include: [appPath('app'), appPath('shared')]
  },

  globalCss: {
    test: /\.s?css$/,
    loader: ENV.__TEST__ ? 'null' : `style!css?sourceMap!${SASS_LOADER}`,
    include: [appPath('style')]
  },

  // For to-string removes the ability to cache css so we use raw in development
  componentCss: {
    test: /\.s?css$/,
    loader: ENV.__TEST__ ? 'null' : `raw!${SASS_LOADER}`,
    exclude: [appPath('style')]
  },

  json: {
    test: /\.json$/,
    loader: 'json'
  },

  file: {
    test: /\.(png|gif|jpg|jpeg|woff|woff2|eof|ttf)$/,
    loader: `file${IS_BUILD ? '?name=[name]-[hash].[ext]' : ''}!image-webpack?bypassOnDebug`,
    include: [rootPath('public/img')]
  },

  svg: {
    test: /\.svg$/,
    loader: 'image-webpack?bypassOnDebug!svg-inline',
    include: [rootPath('public/svg')]
  }
}

if (ENV.__PROD__)
  devtool = false
else if (ENV.__DEV__)
  devtool = '#source-map'
else if (ENV.__STAGING__ || ENV.__TEST__)
  devtool = '#inline-source-map'

var config = {
  cache: true,
  context: CONTEXT,
  devtool,
  entry: ENTRY,

  output: {
    path: BUILD_PATH,
    publicPath: ENV.__PROD__ ? DEFAULT_CDN : '',
    filename: IS_BUILD ? '[name]-[chunkhash].js' : '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: IS_BUILD ? '[id].chunk-[chunkhash].js': '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [NODE_MODULES_PATH, PUBLIC_PATH, APP_ROOT],
    alias: {
      vendor: rootPath('vendor')
    }
  },

  module: {
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    rules: Object.values(preLoaders)
      .map(loader => Object.assign(loader, {enforce: 'pre'}))
      .concat(Object.values(loaders))
  },

  plugins: [
    new ForkCheckerPlugin(),
    new DefinePlugin(ENV),
    new HtmlWebpackPlugin(HTML_PLUGIN_CONFIG),
    new LoaderOptionsPlugin({
      debug: !ENV.__PROD__ && !ENV.__STAGING__
    }),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      rootPath('./src')
    )
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
}

if (!ENV.__TEST__)
  config.plugins.push(
    new CommonsChunkPlugin({
      name: 'vendor',
      chunks: Object.keys(ENTRY).filter(key => ENV.__IS_WEBWORKER__ ? key !== 'app' : true),
      filename: IS_BUILD ? 'vendor-[chunkhash].js' : 'vendor.js',
      minChunks: Infinity
    })
  )

if (!ENV.__DEV__)
  config.plugins.push(new ProgressPlugin(percentage => progressBar.update(percentage)),)

if (ENV.__AOT__) {
  loaders.javascript.loader = '@ngtools/webpack'

  config.plugins.push(
    new AotPlugin({
      tsConfigPath: rootPath('tsconfig.json'),
      basePath: APP_ROOT,
      entryModule: 'app/app.module#AppModule',
      genDir: buildPath('ngfactory')
    })
  )
}

if (ENV.__DEV__) {
  var WebpackNotifierPlugin = require('webpack-notifier')

  config.plugins.push(
    new WebpackDashboard({title: name}),
    new WebpackNotifierPlugin({
      title: name,
      contentImage: rootPath('./favicon.ico')
    })
  )
} else if (IS_BUILD) {
  loaders.globalCss.loader = ExtractTextPlugin.extract(loaders.globalCss.loader.replace('style!', ''))

  config.plugins.push(
    // https://github.com/webpack/webpack/issues/2644
    // new DedupePlugin(),
    new V8LazyParsePlugin(),
    new ExtractTextPlugin('[name]-[chunkhash].css'),
    new LimitChunkCountPlugin({maxChunks: 15}),
    new MinChunkSizePlugin({minChunkSize: 10000}),
    new UglifyJsPlugin({
      compress: {
        negate_iife: false // eslint-disable-line camelcase
      }
    }),
    new CommonsChunkPlugin({
      name: 'common',
      async: true,
      minChunks: 2
    })
  )
} else if (ENV.__TEST__) {
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
        ContentEncoding(file) {
          if (/css|js/.test(file))
            return 'gzip'
        }
      },
      cdnizerOptions: {
        defaultCDNBase: DEFAULT_CDN
      }
    })

    // new S3Plugin({
    //   directory: BUILD_PATH,
    //   basePath: 'public/',
    //   exclude: /\.svg$/,
    //   include: loaders.file.test,
    //   s3Options: {
    //     accessKeyId: AWS_ACCESS_KEY,
    //     secretAccessKey: AWS_SECRET_KEY,
    //     region: AWS_REGION
    //   },
    //   s3UploadOptions: {
    //     Bucket: AWS_BUCKET,
    //     CacheControl: 'max-age=315360000, no-transform, public'
    //   }
    // })
  )
else
  vendor.push('zone.js/dist/long-stack-trace-zone')

export default config
