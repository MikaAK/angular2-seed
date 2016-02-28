import {Component} from 'angular2/core'
import {PostApi} from 'api/post'

@Component({
  selector: 'home',
  template: require('./home.jade')()
})
export class HomeComponent {
  public greeting: string,

  constructor(_postApi: PostApi) {
    _postApi.findAll()
      .subscribe(posts => {
        debugger
      })

    this.greeting = 'webpack-ng2-seed'
  }
}
