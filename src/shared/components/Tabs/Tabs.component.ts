import {
  Component,
  Output,
  ContentChildren,
  EventEmitter,
  AfterContentInit,
  QueryList
} from '@angular/core'

import {isEmpty, prop} from 'ramda'

import {Tab} from './Tab/Tab.component'

@Component({
  selector: 'tabs',
  template: require('./Tabs.jade')(),
  styles: [require('./Tabs.scss')]
})
export class Tabs implements AfterContentInit {
  @Output() public onSelect = new EventEmitter()
  @ContentChildren(Tab) private tabs: QueryList<Tab>

  public ngAfterContentInit() {
    const activeTabs = this.tabs
      .filter(prop('active'))

    if (activeTabs.length > 1)
      throw Error('To many tab active')
    else if (isEmpty(activeTabs) && this.tabs.first)
      this.tabs.first.active = true
  }

  public selectTab(tab) {
    tab.active = true

    this.tabs
      .forEach((tabItem: Tab) => {
        if (tabItem !== tab && tabItem.active)
          tabItem.active = false
      })

    this.onSelect.emit(tab)
  }
}
