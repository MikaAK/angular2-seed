import {Component, Input, Output, EventEmitter, HostBinding} from '@angular/core'

import {ModalService} from './Modal.service'

@Component({
  selector: 'modal',
  template: require('./Modal.pug')(),
  styles: [require('./Modal.scss')]
})
export class Modal {
  @Input() public title: string
  @Output() public onClose = new EventEmitter()
  @Output() public onOpen = new EventEmitter()
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

