import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {RouterModule} from '@angular/router'

import {AppComponent} from './app.component'
import {routerConfig} from './app.routes'

@NgModule({
  imports: [BrowserModule, RouterModule, RouterModule.forRoot(routerConfig)],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
