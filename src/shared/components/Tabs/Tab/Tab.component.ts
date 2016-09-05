import {Component, Input} from '@angular/core'

@Component({
  selector: 'tab',
  template: require('./Tab.pug')()
})
export class Tab {
  @Input() public active: boolean
  @Input() public disabled: boolean
  @Input() public title: string
}

