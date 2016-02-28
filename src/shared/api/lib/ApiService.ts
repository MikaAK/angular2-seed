import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {Observable} from 'rxjs/Observable'
import {API_BASE} from './config'
import {
  log, setHeaders,
  toJSON, serializeKeys,
  deserializeKeys, serializeParamKeys,
  addSlash, deserializeResponse,
  createModel
} from './helpers'

@Injectable()
export class ApiService<T> {
  public endpoint: string
  public model: any

  constructor(public http: Http) {}

  public createUrl(url?: string[]|string): string {
    var urlParams = Array.isArray(url) ? url.join('/') : url

    if (!this.endpoint)
      throw new Error('You did not provide an endpoint for this resource.')

    return addSlash(API_BASE) + addSlash(this.endpoint) + (urlParams || '')
  }

  public get(url, params?: Object): Observable<T> {
    var qParams = this._serializeParams('GET', params)

    log('Creating Get Request: ', this.createUrl(url), qParams)

    return this.http.get(this.createUrl(url), qParams)
      .map(data => this._deserialize('GET', data))
  }

  public post(url, data?: Object, params?: Object): Observable<T> {
    var sendData = this._serializeData('POST', data),
        qParams = this._serializeParams('POST', params)

    log('Creating Post Request: ', this.createUrl(url), sendData, qParams)

    return this.http.post(this.createUrl(url), toJSON(sendData), qParams)
      .map(rData => this._deserialize('POST', rData))
  }

  public put(url, data?: Object, params?: Object): Observable<T> {
    var sendData = this._serializeData('PUT', data),
        qParams = this._serializeParams('PUT', params)

    log('Creating Put Request: ', this.createUrl(url), sendData, qParams)

    return this.http.put(this.createUrl(url), toJSON(sendData), qParams)
      .map(rData => this._deserialize('PUT', rData))
  }

  public delete(url, params?: Object): Observable<T> {
    var qParams = this._serializeParams('DELETE', params)

    log('Creating Delete Request: ', this.createUrl(url), qParams)

    return this.http.delete(this.createUrl(url), qParams)
      .map(rData => this._deserialize('DELETE', rData))
  }

  public serialize(method: string, data: T): any {
    return data
  }

  public deserialize(method: string, data: any): T {
    return data
  }

  public serializeParams(method: string, params: any): any {
    return params
  }

  private _deserialize(method: string, data: any) {
    var rData = deserializeKeys(deserializeResponse(data))

    if (Array.isArray(rData))
      return rData.map(iData => this.deserialize(method, createModel(this.model, iData)))
    else
      return this.deserialize(method, createModel(this.model, rData))
  }

  private _serializeParams(method: string, params: any) {
    return serializeParamKeys(setHeaders(this.serializeParams(method, params)))
  }

  private _serializeData(method: string, data: any) {
    var sData = Array.isArray(data) ? data.map(iData => this.serialize(method, iData)) : data

    return serializeKeys(sData)
  }
}

