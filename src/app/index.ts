import {Component} from '@angular/core'
import {Routes, ROUTER_DIRECTIVES} from '@angular/router'

import {HomeComponent} from './Home'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([{
  path: '/',
  component: HomeComponent
}])
export class AppComponent {
}
