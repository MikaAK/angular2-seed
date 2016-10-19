declare const __IS_BUILD__: boolean

import {bootloader} from '@angularclass/hmr'
import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModuleNgFactory} from './app/app.module.ngfactory'

const main = () => platformBrowserDynamic()
  .bootstrapModuleFactory(AppModuleNgFactory)

if (__IS_BUILD__) {
  enableProdMode()
  main()
} else {
  bootloader(main)
}
