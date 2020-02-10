import { Component, HostListener, ViewChild, ElementRef } from '@angular/core'
import { MenuModel } from './model/menu'
import { faArchive, faListAlt, faArrowCircleDown, faArrowCircleRight,
  faArrowCircleUp, faPrint, faUsers, faPhone, faDownload, faAnchor,
  faUser, faClipboard, faCalendar, faCheckSquare, faBan, faCogs, faChartArea,
  faPhoneVolume, faBook, faFlag } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  icons = {
    faArchive, faListAlt, faArrowCircleDown, faArrowCircleRight,
    faArrowCircleUp, faPrint, faUsers, faPhone, faDownload, faAnchor,
    faUser, faClipboard, faCalendar, faCheckSquare, faBan, faCogs, faChartArea,
    faPhoneVolume, faBook, faFlag
  }

  public hidden = true
  public search = ''

  @ViewChild('menu') menu: ElementRef<HTMLDivElement>

  constructor(public menuModel: MenuModel) { }

  toggle() {
    this.hidden = !this.hidden
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    let target = event.target as HTMLElement
    if (!target.closest('.menu-trigger') && !this.menu.nativeElement.contains(target)) {
      this.hidden = true
    }
  }

}
