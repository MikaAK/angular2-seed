import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {TextSelectorItem, TextSelector} from './text-selector.component'

@NgModule({
  imports: [CommonModule],
  exports: [TextSelector, TextSelectorItem],
  declarations: [TextSelector, TextSelectorItem]
})
export class TextSelectorModule {
}
