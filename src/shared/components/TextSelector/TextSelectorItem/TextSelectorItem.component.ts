import {Component, Input, HostBinding} from '@angular/core'

@Component({
  selector: 'text-selector-item',
  templateUrl: './TextSelectorItem.pug',
  styleUrls: ['./TextSelectorItem.scss']
})
export class TextSelectorItem {
  @Input() public value: any
  @Input() public active: boolean

  @HostBinding('class.active') public get isActive() {
    return this.active
  }

  public toggleActive() {
    this.active = !this.active
  }
}
