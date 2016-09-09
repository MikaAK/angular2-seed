import {Component, Input} from '@angular/core'

@Component({
  selector: 'progressive-image',
  templateUrl: './progressive-image.pug',
  styleUrls: ['./progressive-image.scss']
})
export class ProgressiveImage {
  @Input() public highResSrc: string
  @Input() public lowResSrc: string

  public showLowRes = true
  public showHighRes = false

  public highResLoaded() {
    this.showHighRes = true

    setTimeout(() => this.showLowRes = false, 3000)
  }
}
