import { Component, QueryList, AfterContentInit, ContentChildren } from '@angular/core'
import { TabComponent } from './tab/tab.component'

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.component.html',
  styleUrls: ['./tab-panel.component.scss']
})
export class TabPanelComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabComponents: QueryList<TabComponent>

  public tabs: TabComponent[] = []

  constructor() { }

  ngAfterContentInit(): void {
    this.tabComponents.forEach(tab => this.tabs.push(tab))
    this.tabs[0].active = true
  }

  selectTab(tab: TabComponent): void {
    this.tabs.forEach(tab => tab.active = false)
    tab.active = true
  }

  get activeTab(): TabComponent {
    return this.tabs.find(tab => tab.active)
  }

}
