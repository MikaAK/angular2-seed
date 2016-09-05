import {Component} from '@angular/core'

@Component({
  selector: 'app',
  template: require('./app.pug')(),
  styles: [require('./app.scss')]
})
export class AppComponent {
}

