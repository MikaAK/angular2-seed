declare const __IS_BUILD__: boolean, __IS_WEBWORKER__: boolean

import 'rxjs/add/operator/filter'

import {bootloader} from '@angularclass/hmr'
import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from 'app/app.module'

const main = () => platformBrowserDynamic()
  .bootstrapModule(AppModule)

if (__IS_BUILD__) {
  enableProdMode()
  main()
} else {
  bootloader(main)
}
