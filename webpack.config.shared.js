import {merge, equals} from 'ramda'
import path from 'path'
import ProgressBar from 'progress'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import S3Plugin from 'webpack-s3-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import V8LazyParsePlugin from 'v8-lazy-parse-webpack-plugin'
import {ForkCheckerPlugin} from 'awesome-typescript-loader'
import {AotPlugin} from '@ngtools/webpack'
import {name} from './package.json'
import {
  DefinePlugin,
  ContextReplacementPlugin,
  ProgressPlugin,
  LoaderOptionsPlugin,
  optimize
} from 'webpack'

const {
  DedupePlugin,
  OccurenceOrderPlugin,
  LimitChunkCountPlugin,
  MinChunkSizePlugin,
  UglifyJsPlugin
} = optimize

export const CONTEXT = path.resolve(__dirname)
export const rootPath = (nPath) => path.resolve(CONTEXT, nPath)
export const DEV_SERVER_PORT = 4000
export const APP_ROOT = rootPath('src')
export const PUBLIC_PATH = rootPath('public')
export const NODE_MODULES_PATH = rootPath('node_modules')
export const appPath = (nPath) => path.resolve(APP_ROOT, nPath)
export const {IS_AOT, NODE_ENV, IS_BUILD_COMMAND, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET, CDN_URL} = process.env
export const BUILD_PATH = rootPath('build')
export const buildPath = (nPath) => path.resolve(BUILD_PATH, nPath)
export const IS_WEBWORKER = false
export const IS_STAGING = NODE_ENV === 'staging'
export const IS_PROD = NODE_ENV === 'production'
export const IS_BUILD = IS_STAGING || IS_PROD
export const DEFAULT_CDN = CDN_URL || `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`
export const AOT_DIR = buildPath('ngfactory')

export const OUTPUT_CONFIG = {
  path: BUILD_PATH,
  publicPath: IS_PROD ? DEFAULT_CDN : '',
  filename: IS_BUILD ? '[name]-[chunkhash].js' : '[name].js',
  sourceMapFilename: '[name].map',
  chunkFilename: IS_BUILD ? '[id].chunk-[chunkhash].js': '[id].chunk.js'
}

var devtool

const progressBar = new ProgressBar('[:bar] :percent (:current/:total)', {
  complete: '-',
  incomplete: ' ',
  total: 100
})

export const ProgressBarPlugin = new ProgressPlugin(percentage => progressBar.update(percentage))

export const ENV = {
  __CDN_URL__: DEFAULT_CDN,
  __AOT__: IS_AOT,
  __DEV__: NODE_ENV === 'development',
  __PROD__: IS_PROD,
  __TEST__: NODE_ENV === 'test',
  __STAGING__: IS_STAGING,
  __IS_WEBWORKER__: IS_WEBWORKER,
  __IS_BUILD__: IS_BUILD
}

export const SHARED_PLUGINS = [
  new DefinePlugin(ENV),
  new ForkCheckerPlugin(),
  new ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    rootPath('./src')
  ),
  new LoaderOptionsPlugin({
    minimize: IS_BUILD,
    debug: !IS_PROD && !IS_STAGING
  })
]

const SASS_LOADER = `${IS_BUILD ? 'postcss!' : ''}sass?sourceMap`

export const PRE_LOADERS = {
  tslint: {
    test: /\.ts$/,
    enforce: 'pre',
    loader: 'tslint',
    exclude: [NODE_MODULES_PATH],
    include: [APP_ROOT]
  }
}

export const LOADERS = {
  javascript: {
    test: /\.ts$/,
    loader: [
      'awesome-typescript',
      'angular2-router?loader=system',
      'angular2-template',
      `@angularclass/hmr-loader?pretty=${!IS_BUILD}&prod=${IS_BUILD}`
    ],
    exclude: [NODE_MODULES_PATH],
    include: [APP_ROOT]
  },

  html: {
    test: /\.pug/,
    loader: [`apply?${JSON.stringify(ENV)}`, 'pug'],
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
    test: /\.(png|gif|jpg|jpeg)$/,
    loader: [`file${IS_BUILD ? '?name=[name]-[hash].[ext]' : ''}`, 'image-webpack?bypassOnDebug'],
    include: [rootPath('public/img')]
  },

  svg: {
    test: /\.svg$/,
    loader: ['svg-inline', 'image-webpack?bypassOnDebug'],
    include: [rootPath('public/svg')]
  }
}

const findAndTransformRule = (rule, config, transform) => {
  const ruleIndex = config.module.rules.findIndex(equals(rule))

  if (ruleIndex !== -1)
    config.module.rules[ruleIndex] = transform(config.module.rules[ruleIndex])
}

export const makeConfig = (customConfig) => {
  if (ENV.__PROD__)
    devtool = false
  else if (ENV.__DEV__)
    devtool = '#source-map'
  else if (ENV.__STAGING__ || ENV.__TEST__)
    devtool = '#inline-source-map'

  const config = merge(customConfig, {
    cache: true,
    context: CONTEXT,
    devtool
  })

  if (ENV.__AOT__) {
    findAndTransformRule(LOADERS.javascript, config, () => ({
      test: /\.ts/,
      exclude: [/\.(spec|e2e)\.ts$/],
      loader: '@ngtools/webpack'
    }))

    config.plugins.push(
      new AotPlugin({
        tsConfigPath: rootPath('tsconfig.json'),
        typeChecking: false
      })
    )
  }

  if (ENV.__DEV__) {
    var WebpackNotifierPlugin = require('webpack-notifier')

    config.plugins.push(
      new WebpackNotifierPlugin({
        title: name,
        contentImage: rootPath('./favicon.ico')
      })
    )
  } else if (IS_BUILD) {
    findAndTransformRule(LOADERS.globalCss, config, (rule) => Object.assign(rule, {
      loader: ExtractTextPlugin.extract(LOADERS.globalCss.loader.replace('style!', ''))
    }))

    config.plugins.push(
      // https://github.com/webpack/webpack/issues/2644
      // new DedupePlugin(),
      new V8LazyParsePlugin(),
      new ExtractTextPlugin('[name]-[chunkhash].css'),
      new LimitChunkCountPlugin({maxChunks: 15}),
      new MinChunkSizePlugin({minChunkSize: 10000}),
      new UglifyJsPlugin({
        sourceMap: false,
        output: {
          comments: false
        },
        compress: {
          warnings: false,
          negate_iife: false // eslint-disable-line camelcase
        }
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
    )

  return config
}
