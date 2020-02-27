import { Component, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { ComponentInstance } from '@angular/core/src/render3/interfaces/player'

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {

  @Input() items: { name: string, text: string }[]
  @Input() host: ComponentInstance

  @ViewChild('menu') menu: ElementRef<HTMLDivElement>

  hidden = true

  constructor() { }

  toggle(): void {
    this.hidden = !this.hidden
  }

  onItemClick(item: { name: string, text: string }): void {
    this.host[item.name]() // we call the method of the host which name equals the name of the item
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    let target = event.target as HTMLElement
    if (!this.menu.nativeElement.contains(target)) {
      this.hidden = true
    }
  }

}
