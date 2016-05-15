/* tslint:disable no-shadowed-variable */
declare var require: {
  <T>(path: string): T
  (paths: string[], callback: (...modules: any[]) => void): void
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void
}

import {Routes} from '@ngrx/router'

// Use loadComponent with require.ensure to async load with webpack
export const ROUTES: Routes = [{
  path: '/',
  loadComponent: () => new Promise(resolve => {
    require.ensure([], require => resolve(require<any>('./home').HomeComponent))
  })
}])
/* tslint:enable */
