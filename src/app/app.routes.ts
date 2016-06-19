import {provideRouter, RouterConfig} from '@angular/router'

import {HomeComponent} from './home'

const ROUTES: RouterConfig = [{
  path: '',
  component: HomeComponent
}]

export const APP_ROUTER_PROVIDERS = [
  provideRouter(ROUTES)
]
