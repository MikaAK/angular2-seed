import {RestApi} from './lib/RestApi'
import {Http} from 'angular2/http'
import {Injectable} from 'angular2/core'

class Post {
  public id: number
  public userId: number
  public title: string
  public body: string

  public titleAndBody(): string {
    return `
      ${this.title}

      ${this.body}
    `
  }
}

@Injectable()
export class PostApi extends RestApi<Post> {
  public endpoint = 'posts'
  public model = Post

  constructor(http: Http) {super(http)}
}
