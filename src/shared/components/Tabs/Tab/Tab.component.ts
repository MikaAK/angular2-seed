import {Component, Input} from '@angular/core'

@Component({
  selector: 'tab',
  templateUrl: './tab.pug'
})
export class Tab {
  @Input() public active: boolean
  @Input() public disabled: boolean
  @Input() public title: string
}

