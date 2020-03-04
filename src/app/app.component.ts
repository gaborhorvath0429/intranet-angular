import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd } from '@angular/router'
import { AuthenticationService } from './core/services/authentication.service'
import { ExtjsService } from './core/services/extjs.service'

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
      if (e instanceof NavigationEnd && e.url !== '/' && !e.url.includes('/login')) {
        window.localStorage.setItem('uriToken', e.url)
      }
    })
  }
}
