import {Component, Input} from '@angular/core'

@Component({
  selector: 'tab',
  templateUrl: './tab.pug'
})
export class Tab {
  @Input() active: boolean
  @Input() disabled: boolean
  @Input() title: string
}

