import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {Modal} from './Modal.component'
import {ModalService} from './Modal.service'

export * from './Modal.service'

@NgModule({
  imports: [CommonModule],
  exports: [Modal, ModalService],
  declarations: [Modal, ModalService]
})
export class ModalModule {
}
