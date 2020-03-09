import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core'
import { MenuModel } from './model/menu'
import { faArchive, faListAlt, faArrowCircleDown, faArrowCircleRight,
  faArrowCircleUp, faPrint, faUsers, faPhone, faDownload, faAnchor,
  faUser, faClipboard, faCalendar, faCheckSquare, faBan, faCogs, faChartArea,
  faPhoneVolume, faBook, faFlag } from '@fortawesome/free-solid-svg-icons'
import { MostVisitedMenusService } from '../../services/socket.service'
import { Router } from '@angular/router'

interface MenuItem {
  path: string
  id: number
  parent?: number
  score?: number
  title: string
  icon: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MostVisitedMenusService]
})
export class MenuComponent implements OnInit {

  icons = {
    faArchive, faListAlt, faArrowCircleDown, faArrowCircleRight,
    faArrowCircleUp, faPrint, faUsers, faPhone, faDownload, faAnchor,
    faUser, faClipboard, faCalendar, faCheckSquare, faBan, faCogs, faChartArea,
    faPhoneVolume, faBook, faFlag
  }

  public hidden = true
  public search = ''
  public mostVisitedMenus: MenuItem[] = []

  @ViewChild('menu') menu: ElementRef<HTMLDivElement>

  constructor(
    public menuModel: MenuModel,
    private mostVisitedMenusService: MostVisitedMenusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initMostVisitedMenus()
  }

  public initMostVisitedMenus(): void {
    this.mostVisitedMenusService.fromEvent('read').subscribe((items: { score: number, menu: string }[]) => {
      let menus = []
      items.forEach(function(menu) {
        let score = menu.score
        let data = JSON.parse(menu.menu)
        menus.push({
          id: data.id,
          score: score,
          path: data.path,
          title: data.title,
          icon: MenuModel.makeCamelCase(data.icon)
        })
      })

      this.mostVisitedMenus = menus.sort((a, b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0)).reverse()
    })

    this.mostVisitedMenusService.emit('read')
  }

  public toggle(): void {
    this.hidden = !this.hidden
    this.mostVisitedMenusService.emit('read')
  }

  public addToMostVisited(menu: MenuItem): void {
    delete menu.score
    delete menu.parent
    this.mostVisitedMenusService.emit('create', JSON.stringify(menu))
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    let target = event.target as HTMLElement
    if (!target.closest('.menu-trigger') && !this.menu.nativeElement.contains(target)) {
      this.hidden = true
    }
  }

  public onMenuItemClick(menu: MenuItem): void {
    this.toggle()
    if (this.router.url.replace('/', '') !== menu.path) {
      this.addToMostVisited(menu)
    }
  }

}
