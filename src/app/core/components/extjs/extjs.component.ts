import { Component, OnInit } from '@angular/core'
import { ExtjsService } from '../../services/extjs.service'
import { Router } from '@angular/router'
import { TaskbarService } from '../../services/taskbar.service'
import * as _ from 'lodash'

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
          var mainWindow = null
          switch (url.replace('/', '')) {
            case 'cross-border-loader':
              mainWindow = controller.getLoaderWindow()
              break
            case 'cross-border-uploader':
              mainWindow = controller.getUploadWindow()
              break
            default:
              mainWindow = controller.getMainWindow()
          }
          mainWindow.on('close', () => {
            this.taskbarService.remove(url)
          }, null, { single: true })
        }, 1000)
      }
    })
  }

  private initPage(url: string) {
    let controller = null

    if (url === 'cross-border-loader') {
      controller = Intranet.getApplication().getController('CrossBorder.controller.Loader')
    } else if (url === 'cross-border-uploader') {
      controller = Intranet.getApplication().getController('CrossBorder.controller.Uploader')
    } else if (url === 'autoreport') {
      controller = Intranet.getApplication().getController('AutoReport.controller.Main')
    } else {
      // convert url to PascalCase and call the appropriate controller
      controller = Intranet.getApplication().getController(_.upperFirst(_.camelCase(url)) + '.controller.Main')
    }

    if (!controller) return console.error('NO EXTJS ROUTE FOR ' + url)

    controller.main()

    return controller
  }
}
