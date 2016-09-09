import {Routes, RouterModule} from '@angular/router'

const routerConfig: Routes = [{
  path: '',
  loadChildren: () => System.import('./home')
}]

export const AppRouting = RouterModule.forRoot(routerConfig)
