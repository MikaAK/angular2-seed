import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'

import {TabsModule} from 'shared/components/Tabs'
import {ModalModule} from 'shared/components/Modal'

import {HomeComponent} from './Home.component'

const routeConfig = [{
  path: 'home',
  component: HomeComponent
}]

@NgModule({
  imports: [ModalModule, TabsModule, RouterModule.forRoot(routeConfig)]
  exports: [HomeComponent],
  declarations: [HomeComponent]
})
export default class HomeModule {
}
