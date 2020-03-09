import { Component, OnInit } from '@angular/core'
import { ExtjsService } from '../../services/extjs.service'
import { Router } from '@angular/router'
import { TaskbarService } from '../../services/taskbar.service'

declare const Ext: any
declare const Core: any
declare const Intranet: any

@Component({
  selector: 'app-extjs',
  templateUrl: './extjs.component.html',
  styleUrls: ['./extjs.component.scss']
})
export class ExtjsComponent implements OnInit {

  constructor(
    private extjsService: ExtjsService,
    private router: Router,
    private taskbarService: TaskbarService
  ) { }

  ngOnInit() {
    Ext.onReady(() => {
      let { url } = this.router
      if (url !== '/') {
        let controller = this.initPage(url.replace('/', ''))
        this.extjsService.show()
        Ext.defer(() => { // sometimes the window is not created yet
          controller.getMainWindow().on('close', () => {
            this.taskbarService.remove(url)
          }, null, { single: true })
        }, 1000)
      }
    })
  }

  private initPage(url: string) {
    let controller = null
    switch (url) {
      case 'report':
        controller = Intranet.getApplication().getController('Report.controller.Main')
        break
      case 'unident-payment':
        controller = Intranet.getApplication().getController('UnidentPayment.controller.Main')
        break
      case 'file-uploader':
        controller = Intranet.getApplication().getController('FileUploader.controller.Main')
        break
      case 'viekr':
        controller = Intranet.getApplication().getController('Viekr.controller.Main')
        break
      case 'overpayment-inclusion':
        controller = Intranet.getApplication().getController('OverpaymentInclusion.controller.Main')
        break
      default:
        console.error('NO EXTJS ROUTE FOR ' + url)
    }

    controller.main()

    return controller
  }
}
