import {Component, OnInit} from '@angular/core'
import {ROUTER_DIRECTIVES, Router} from '@angular/router'

import {APP_PROVIDERS} from './app.providers.ts'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')],
  directives: ROUTER_DIRECTIVES,
  providers: APP_PROVIDERS
})
export class AppComponent implements OnInit {
  constructor(private _router: Router) {}

  public ngOnInit() {
    // Hack to get to home by default
    this._router.navigate([''])
  }
}

