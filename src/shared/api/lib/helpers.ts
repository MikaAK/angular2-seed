declare const __DEV__: boolean

import {Headers, Response} from 'angular2/http'
import * as _ from 'lodash'
import {DEFAULT_HEADERS} from './config'

const convertKeys = function(convertFn): any|any[] {
  const convert = function(params) {
    if (Array.isArray(params))
      return _.map(params, convert)
    else if (params && typeof params === 'object') {
      return _.reduce(params, function(res, value, key) {
          var nValue

          if (typeof value === 'object' || Array.isArray(value))
            nValue = convert(value)
          else
            nValue = value

          res[convertFn(key)] = nValue

          return res
        }, {})
    } else
      return params
  }

  return convert
}

const objToQueryParams = function(obj) {
  let str = []

  for (let p in obj)
    if (obj.hasOwnProperty(p))
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)

  return str.join('&')
}

const log = function(...args) {
  if (__DEV__)
    console.log.apply(console, args)
}

const setHeaders = function(params) {
  let headers

  if (params && params.header)
    headers = new Headers(_.extend(params.headers, DEFAULT_HEADERS))
  else
    headers = new Headers(DEFAULT_HEADERS)

  return params ? _.extend(params, {headers}) : {headers}
}

const toJSON = function(data) {
  return data ? JSON.stringify(data) : data
}

const serializeKeys: any|any[] = convertKeys(_.snakeCase)
const deserializeKeys: any|any[] = convertKeys(_.camelCase)

const serializeParamKeys = function(params): Object {
  if (params.params)
    params.params = serializeKeys(params.params)

  return params
}

const addSlash = function(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

const deserializeResponse = function(response: Response): any {
  let contentType = response.headers.get('Content-Type')

  if (/text/.test(contentType))
    return response.text()
  else if (/json/.test(contentType))
    return response.json()
  else
    return response
}

const createModel = function(model, data) {
  var nModel = new model(data)

  debugger
  for (let [key, value] of Object.entries(data))
    if (key in nModel)
      nModel[key] = value

  return nModel
}

export {
  log, setHeaders,
  addSlash, objToQueryParams,
  toJSON, serializeParamKeys,
  serializeKeys, deserializeKeys,
  deserializeResponse, createModel
}

