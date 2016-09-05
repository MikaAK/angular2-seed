import {Component} from '@angular/core'

import {ModalService} from 'shared/components/Modal'

@Component({
  selector: 'home',
  template: require('./Home.pug')()
})
export class HomeComponent {
  public greeting: string

  constructor(public modalService: ModalService) {
    this.greeting = 'webpack-ng2-seed'
  }
}


