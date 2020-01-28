import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public translate: TranslateService) {
    translate.addLangs(['hu', 'en'])
    translate.setDefaultLang('hu')

    const browserLang = translate.getBrowserLang()
    translate.use(browserLang.match(/hu|en/) ? browserLang : 'hu')
  }
}
