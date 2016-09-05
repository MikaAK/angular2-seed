import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

@NgModule({
  imports: [CommonModule],
  exports: [TextSelector, TextSelectorItem],
  declarations: [TextSelector, TextSelectorItem]
})
export class TextSelectorModule {
}
