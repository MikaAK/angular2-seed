import {Component} from '@angular/core'

@Component({
  selector: 'app',
  template: require('./app.jade')(),
  styles: [require('./app.scss')]
})
export class AppComponent {
}
