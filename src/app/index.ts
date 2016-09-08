import {NgModule, ApplicationRef} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {removeNgStyles, createNewHosts} from '@angularclass/hmr'

import {AppComponent} from './app.component'
import {AppRouting} from './app.routes'

@NgModule({
  imports: [BrowserModule, AppRouting],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}

  public hmrOnInit(store) {
    if (!store) return

    // inject AppStore here and update it
    // this.AppStore.update(store)
  }
  public hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components
      .map(cmp => cmp.location.nativeElement)

    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation)

    removeNgStyles()
  }
  public hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts()

    delete store.disposeOldHosts
    // anything you need done the component is removed
  }
}
