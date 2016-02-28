import {Component} from 'angular2/core'

@Component({
  selector: 'home',
  template: require('./Home.jade')()
})
export class HomeComponent {
  public greeting: string

  constructor() {
    this.greeting = 'webpack-ng2-seed'
  }
}
