import {Component} from '@angular/core'
import {ROUTER_DIRECTIVES} from '@angular/router'

import {APP_PROVIDERS} from './app.providers.ts'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: ROUTER_DIRECTIVES,
  providers: APP_PROVIDERS
})
export class AppComponent {
}

