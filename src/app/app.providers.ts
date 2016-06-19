declare const __PROD__: boolean

import {ELEMENT_PROBE_PROVIDERS} from '@angular/platform-browser'
import {HTTP_PROVIDERS} from '@angular/http'
import {disableDeprecatedForms, provideForms} from '@angular/forms'

import {APP_ROUTER_PROVIDERS} from './app.routes.ts'

export const APP_PROVIDERS = [
  disableDeprecatedForms(),
  provideForms(),
  ...(__PROD__ ? [] : ELEMENT_PROBE_PROVIDERS),
  ...HTTP_PROVIDERS,
  ...APP_ROUTER_PROVIDERS
]
