import {Routes, RouterModule} from '@angular/router'

export const routerConfig: Routes = [{
  path: '',
  loadChildren: './home/home.module#HomeModule'
}]

export const AppRouting = RouterModule.forRoot(routerConfig)
