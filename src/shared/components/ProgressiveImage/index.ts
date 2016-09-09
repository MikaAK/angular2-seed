import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

import ImageLoadModule from 'shared/directives/ImageLoad'

import {ProgressiveImage} from './ProgressiveImage.component'

@NgModule({
  imports: [ImageLoadModule, CommonModule],
  exports: [ProgressiveImage],
  declarations: [ProgressiveImage]
})
export default class ProgressiveImageModule {
}
