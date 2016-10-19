import {Component} from '@angular/core'

import {ModalService} from 'shared/components/modal'

@Component({
  selector: 'home',
  templateUrl: './home.pug'
})
export class HomeComponent {
  public greeting: string

  constructor(public modalService: ModalService) {
    this.greeting = 'webpack-ng2-seed'
  }
}


