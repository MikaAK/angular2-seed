import {Component} from '@angular/core'

@Component({
  selector: 'home',
  template: require('./home.jade')()
})
export class HomeComponent {
  public greeting: string

  constructor() {
    this.greeting = 'webpack-ng2-seed'
  }
}


