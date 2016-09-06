import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

import {AppComponent} from './app.component'
import {AppRouting} from './app.routes'

@NgModule({
  imports: [BrowserModule, AppRouting],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
