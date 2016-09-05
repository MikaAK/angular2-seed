import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {Tab} from './Tab/Tab.component'
import {Tabs} from './Tabs.component'

@NgModule({
  imports: [CommonModule],
  exports: [Tab, Tabs],
  declarations: [Tab, Tabs]
})
export class TabsModule {
}
