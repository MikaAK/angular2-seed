import {Component, Input} from '@angular/core'

@Component({
  selector: 'tab',
  template: require('./tab.jade')()
})
export class Tab {
  @Input() public active: boolean
  @Input() public disabled: boolean
  @Input() public title: string
}
