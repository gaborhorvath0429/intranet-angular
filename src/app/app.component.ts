import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd } from '@angular/router'
import { AuthenticationService } from './core/services/authentication.service'
import { ExtjsService } from './core/services/extjs.service'
import { TaskbarService } from './core/services/taskbar.service'
import { MenuModel } from './core/components/menu/model/menu'
import { extjsRoutes } from './app-routing.module'

declare const Ext: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public showHeader = false

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private extjsService: ExtjsService,
    private taskbarService: TaskbarService,
    private menuModel: MenuModel,
    translate: TranslateService
  ) {
    translate.addLangs(['hu', 'en'])
    translate.setDefaultLang('hu')

    const browserLang = translate.getBrowserLang()
    translate.use(browserLang.match(/hu|en/) ? browserLang : 'hu')
  }

  ngOnInit(): void {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.showHeader = Boolean(user)
    })

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (!extjsRoutes.includes(e.url.replace('/', ''))) {
          this.extjsService.hide()
        }
        if (e.url !== '/' && !e.url.includes('/login')) {
          window.localStorage.setItem('uriToken', e.url)
          if (!this.menuModel.data.length) {
            this.menuModel.load().then(() => {
              this.taskbarService.set(e.url)
            })
          } else {
            this.taskbarService.set(e.url)
          }
        }
      }
    })

    Ext.on({
      token_expired: () => {
        this.authenticationService.logout()
        location.reload(true)
      }
    })
  }
}
