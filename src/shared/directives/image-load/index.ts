import {NgModule} from '@angular/core'

import {ImageLoad} from './image-load.directive'

@NgModule({
  exports: [ImageLoad],
  declarations: [ImageLoad]
})
export class ImageLoadModule {
}
