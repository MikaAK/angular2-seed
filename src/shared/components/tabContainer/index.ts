import {
  Component,
  Output,
  ContentChildren,
  EventEmitter,
  AfterContentInit,
  QueryList
} from '@angular/core'

import {isEmpty} from 'ramda'

import {get} from 'shared/helpers/util'

import {Tab} from './tab'

export * from './tab'

@Component({
  selector: 'tab-container',
  template: require('./tabContainer.jade')(),
  styles: [require('./tabContainer.scss')]
})
export class TabContainer implements AfterContentInit {
  @Output() public onSelect = new EventEmitter()
  @ContentChildren(Tab) private tabs: QueryList<Tab>

  public ngAfterContentInit() {
    const activeTabs = this.tabs
      .filter(get('active'))

    if (activeTabs.length > 1)
      throw Error('To many tab active')
    else if (isEmpty(activeTabs) && this.tabs.first)
      this.tabs.first.active = true
  }

  public selectTab(tab) {
    this.tabs
      .forEach((tabItem: Tab) => tabItem.active = tabItem === tab)

    this.onSelect.emit(tab)
  }
}
