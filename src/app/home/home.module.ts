import {NgModule} from '@angular/core'

import {TabsModule} from 'shared/components/tabs'
import {ModalModule} from 'shared/components/modal'

import {HomeComponent} from './home.component'
import {HomeRoutes} from './home.routes'

@NgModule({
  imports: [HomeRoutes, ModalModule, TabsModule],
  declarations: [HomeComponent]
})
export class HomeModule {
}
