import {Routes, RouterModule} from '@angular/router'
import {HomeComponent} from './Home.component'

const routerConfig: Routes = [{
  path: '',
  component: HomeComponent
}]

export const HomeRoutes = RouterModule.forChild(routerConfig)
