/**
 * @file serve
 */
const path = require('path')
const Config = require('webpack-chain')
const defaultsDeep = require('lodash.defaultsdeep')
const {info, prepareUrls} = require('nodeppt-shared-utils')
const {resolveEntry} = require('../lib/utils')
const defaults = require('./options')

module.exports = (e, args) => {
  const {context, entry} = resolveEntry(e)
  const api = new ServiceApi(context, entry, args)
  api.init()
  serve(api, api.options)
    .then(d => {
      // console.log(d)
    })
    .catch(e => {
      console.log(e)
    })
}

class ServiceApi {
  constructor(context, entry, {outputDir = 'dist', host = '0.0.0.0', port = 8080, watch = true, https = false}) {
    this.context = context
    this.entry = entry

    this.watch = watch
    this.webpackChainFns = []
    this.options = defaultsDeep(
      {
        outputDir,
        devServer: {
          host,
          port,
          https
        }
      },
      defaults()
    )
  }
  init() {
    const buildInConfig = ['../config/base', '../config/css', '../config/dev', '../config/prod', '../config/app']
    this.plugins = buildInConfig
      .map(id => require(id))
      .forEach(apply => {
        apply(this, this.options)
      })
  }
  getEntry() {
    return path.resolve(this.entry)
  }
  resolveChainableWebpackConfig() {
    const chainableConfig = new Config()
    // apply chains
    this.webpackChainFns.forEach(fn => fn(chainableConfig))
    return chainableConfig
  }
  /**
   * 获取当前工作目录
   * @return {string} 返回工作目录
   */
  getCwd() {
    return this.context
  }
  chainWebpack(fn) {
    this.webpackChainFns.push(fn)
  }
  /**
   * Resolve path for a project.
   *
   * @param {string} p - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  resolve(p) {
    return path.resolve(this.context, p)
  }
}

async function serve(api, options) {
  info('Starting development server...')
  const defaults = {
    host: '0.0.0.0',
    port: 8080,
    https: false
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const url = require('url')
  const path = require('path')
  const chalk = require('chalk')
  const webpack = require('webpack')

  const WebpackDevServer = require('webpack-dev-server')
  const portfinder = require('portfinder')

  // resolve webpack config
  const webpackConfig = api.resolveChainableWebpackConfig().toConfig()

  // load user devServer options with higher priority than devServer
  // in webpck config
  const projectDevServerOptions = Object.assign(webpackConfig.devServer || {}, options.devServer)
  // entry arg
  const entry = require.resolve('../template/main.js')
  if (entry) {
    webpackConfig.entry = {
      app: api.resolve(entry)
    }
  }
  // resolve server options
  const useHttps = projectDevServerOptions.https || defaults.https
  const protocol = useHttps ? 'https' : 'http'
  const host = projectDevServerOptions.host || process.env.HOST || defaults.host
  portfinder.basePort = projectDevServerOptions.port || process.env.PORT || defaults.port
  const port = await portfinder.getPortPromise()
  const rawPublicUrl = projectDevServerOptions.public
  const publicUrl = rawPublicUrl
    ? /^[a-zA-Z]+:\/\//.test(rawPublicUrl)
      ? rawPublicUrl
      : `${protocol}://${rawPublicUrl}`
    : null
  const urls = prepareUrls(protocol, host, port, options.baseUrl)
  // inject dev & hot-reload middleware entries
  if (!isProduction) {
    const sockjsUrl = publicUrl
      ? `?${publicUrl}/sockjs-node`
      : `?${url.format({
          protocol,
          port,
          hostname: urls.lanUrlForConfig || 'localhost',
          pathname: '/sockjs-node'
        })}`
    const devClients = [
      // dev server client
      require.resolve('webpack-dev-server/client') + sockjsUrl,
      // hmr client
      require.resolve(projectDevServerOptions.hotOnly ? 'webpack/hot/only-dev-server' : 'webpack/hot/dev-server')
    ]
    // inject dev/hot client
    addDevClientToEntry(webpackConfig, devClients)
  }

  // create compiler
  const compiler = webpack(webpackConfig)

  // create server
  const server = new WebpackDevServer(
    compiler,
    Object.assign(
      {
        clientLogLevel: 'none',
        historyApiFallback: {
          disableDotRule: true,
          rewrites: [{from: /./, to: path.posix.join(options.baseUrl, 'index.html')}]
        },
        contentBase: api.resolve('public'),
        watchContentBase: !isProduction,
        hot: !isProduction,
        quiet: true,
        compress: isProduction,
        publicPath: options.baseUrl,
        overlay: isProduction // TODO disable this
          ? false
          : {warnings: false, errors: true}
      },
      projectDevServerOptions,
      {
        https: useHttps,
        before(app, server) {
          // apply in project middlewares
          projectDevServerOptions.before && projectDevServerOptions.before(app, server)
        }
      }
    )
  )

  ;['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0)
      })
    })
  })

  return new Promise((resolve, reject) => {
    // log instructions & open browser on first compilation complete
    let isFirstCompile = true
    compiler.hooks.done.tap('nodeppt-serve', stats => {
      if (stats.hasErrors()) {
        return
      }

      console.log()
      console.log('  App running at:')
      const networkUrl = publicUrl ? publicUrl.replace(/([^/])$/, '$1/') : urls.lanUrlForTerminal
      console.log(`  - Network: ${chalk.cyan(networkUrl)}`)
      console.log()

      if (isFirstCompile) {
        isFirstCompile = false

        // resolve returned Promise
        // so other commands can do api.service.run('serve').then(...)
        resolve({
          server,
          url: urls.localUrlForBrowser
        })
      } else if (process.env.VUE_CLI_TEST) {
        // signal for test to check HMR
        console.log('App updated')
      }
    })

    server.listen(port, host, err => {
      if (err) {
        reject(err)
      }
    })
  })
}

function addDevClientToEntry(config, devClient) {
  const {entry} = config
  if (typeof entry === 'object' && !Array.isArray(entry)) {
    Object.keys(entry).forEach(key => {
      entry[key] = devClient.concat(entry[key])
    })
  } else if (typeof entry === 'function') {
    config.entry = entry(devClient)
  } else {
    config.entry = devClient.concat(entry)
  }
}
