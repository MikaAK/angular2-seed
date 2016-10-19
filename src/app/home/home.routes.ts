import {Routes, RouterModule} from '@angular/router'
import {HomeComponent} from './home.component'

export const routerConfig: Routes = [{
  path: '',
  component: HomeComponent
}]

export const HomeRoutes = RouterModule.forChild(routerConfig)
