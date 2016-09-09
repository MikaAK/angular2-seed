import {Directive, Output, HostListener, EventEmitter} from '@angular/core'

@Directive({selector: 'img[onload]'})
export class ImageLoad {
  @Output('onload') public load = new EventEmitter()

  @HostListener('onload')
  public onLoad($event) {
    this.load.emit($event)
  }
}
