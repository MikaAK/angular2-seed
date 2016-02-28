import {Observable} from 'rxjs/Observable'
import {ApiService} from './ApiService'

export class RestApi<T> extends ApiService<T> {
  public idAttribute: string

  public find(id: number|string, params?: Object): Observable<any> {
    return this.get(<string>id, params)
  }

  public findAll(params?: Object): Observable<any> {
    return this.get(null, params)
  }

  public create(data: Object, params?: Object): Observable<any> {
    return this.post(data[this.idAttribute], data, params)
  }

  public update(data, params?: Object): Observable<any> {
    return this.put(data[this.idAttribute], data, params)
  }

  public destroy(id?: number|Object): Observable<any> {
    var params

    if (typeof id === 'object') {
      params = id
      id = null
    }

    return this.delete(id, params)
  }
}

