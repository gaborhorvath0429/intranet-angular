import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { MenuModel } from '../components/menu/model/menu'

export interface TaskbarItem {
  text: string
  url: string
  active: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TaskbarService {

  constructor(
    private router: Router,
    private menuModel: MenuModel
  ) { }

  items: TaskbarItem[] = []

  set(url: string): void {
    if (url.includes('/regulation/')) url = '/regulation' // TODO make this general
    let text = this.menuModel.data.find(e => e.path === url.replace('/', '')).title
    this.items.forEach(item => item.active = false)
    let item = this.items.find(e => e.url === url)
    if (!item) {
      this.items.push({ text, url, active: true })
    } else {
      item.active = true
    }
  }

  remove(url: string): void {
    this.items = this.items.filter(e => e.url !== url)
    if (this.items.length) {
      this.router.navigateByUrl(this.items[this.items.length - 1].url)
    }
  }
}
