import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import {ImageLoadModule} from 'shared/directives/image-load'

import {ProgressiveImage} from './progressive-image.component'

@NgModule({
  imports: [ImageLoadModule, CommonModule],
  exports: [ProgressiveImage],
  declarations: [ProgressiveImage]
})
export class ProgressiveImageModule {
}
