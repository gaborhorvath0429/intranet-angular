import { Component, OnInit } from '@angular/core'
import { ExtjsService } from '../../services/extjs.service'
import { Router } from '@angular/router'

declare const Intranet: any

@Component({
  selector: 'app-extjs',
  templateUrl: './extjs.component.html',
  styleUrls: ['./extjs.component.scss']
})
export class ExtjsComponent implements OnInit {

  constructor(
    private extjsService: ExtjsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initRoute()
  }

  private initRoute(): void {
    let { url } = this.router
    if (url !== '/') {
      if (!Intranet.getApplication) {
        setTimeout(() => { this.initRoute() }, 200)
        return
      }
      this.initPage(url.replace('/', ''))
      this.extjsService.show()
    }
  }

  private initPage(url: string): void {
    switch (url) {
      case 'unident-payment':
        Intranet.getApplication().getController('UnidentPayment.controller.Main').main()
        break
      case 'file-uploader':
        Intranet.getApplication().getController('FileUploader.controller.Main').main()
        break
      default:
        console.error('NO EXTJS ROUTE FOR ' + url)
    }
  }
}
