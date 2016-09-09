import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {Modal} from './modal.component'
import {ModalService} from './modal.service'

export * from './modal.service'

@NgModule({
  imports: [CommonModule],
  declarations: [Modal],
  exports: [Modal],
  providers: [ModalService]
})
export class ModalModule {
}
