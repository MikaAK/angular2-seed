import {Component} from '@angular/core'

import {ModalService, Modal} from 'shared/components/modal'
import {TabContainer, Tab} from 'shared/components/tabContainer'

@Component({
  selector: 'home',
  template: require('./home.jade')(),
  providers: [ModalService],
  directives: [Modal, TabContainer, Tab]
})
export class HomeComponent {
  public greeting: string

  constructor(public modalService: ModalService) {
    this.greeting = 'webpack-ng2-seed'
  }
}


