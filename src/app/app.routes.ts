import {Routes} from '@angular/router'

export const routerConfig: Routes = [{
  path: '',
  loadChildren: () => System.import('./Home')
}]
