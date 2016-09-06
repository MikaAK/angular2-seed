import {NgModule} from '@angular/core'

import {TabsModule} from 'shared/components/Tabs'
import {ModalModule} from 'shared/components/Modal'

import {HomeComponent} from './Home.component'
import {HomeRoutes} from './Home.routes'

@NgModule({
  imports: [HomeRoutes, ModalModule, TabsModule],
  declarations: [HomeComponent]
})
export default class HomeModule {
}
