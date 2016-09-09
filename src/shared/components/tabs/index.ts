import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {Tab} from './tab/tab.component'
import {Tabs} from './tabs.component'

@NgModule({
  imports: [CommonModule],
  exports: [Tab, Tabs],
  declarations: [Tab, Tabs]
})
export class TabsModule {
}
