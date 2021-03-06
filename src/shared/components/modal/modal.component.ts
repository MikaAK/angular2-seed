import {Component, Input, Output, EventEmitter, HostBinding} from '@angular/core'

import {ModalService} from './modal.service'

@Component({
  selector: 'modal',
  templateUrl: './modal.pug',
  styleUrls: ['./modal.scss']
})
export class Modal {
  @Input() title: string
  @Output() onClose = new EventEmitter()
  @Output() onOpen = new EventEmitter()
  public _isOpenLast = false

  constructor(public modalService: ModalService) {}

  @HostBinding('hidden') public get _isHidden() {
    return !this.modalService.isOpen
  }

  public ngDoCheck() {
    if (this._isOpenLast !== this.modalService.isOpen) {
      if (this.modalService.isOpen)
        this.onOpen.emit(true)
      else
        this.onClose.emit(true)

      this._isOpenLast = this.modalService.isOpen
    }
  }
}

