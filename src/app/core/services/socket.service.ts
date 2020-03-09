import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'

@Injectable()
export class GridViewService extends Socket {
  constructor() {
    super({ url: 'http://localhost:8888/grid-view', options: {} })
  }
}

@Injectable()
export class NotificationService extends Socket {
  constructor() {
    super({ url: 'http://localhost:8888/notification', options: {} })
  }
}

@Injectable()
export class MostVisitedMenusService extends Socket {
  constructor() {
    super({ url: 'http://localhost:8888/most-visited-menus', options: {} })
  }
}
