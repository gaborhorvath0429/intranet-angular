import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MenuModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/permission/modules',
    reader: {
      root: 'result',
      totalProperty: 'totalCount'
    }
  }

  fields = [{
    name: 'id',
    type: 'int'
  }, {
    name: 'path',
    type: 'string'
  }, {
    name: 'title',
    type: 'string'
  }, {
    name: 'icon',
    convert(record: any) {
      return MenuModel.makeCamelCase(record.icon)
    },
    type: 'string'
  }]

  static makeCamelCase(str: string): string {
    return str.replace('fa ', '').replace('fa-fa ', '').replace('-o', '')
      .replace('fa-area-chart', 'fa-chart-area')
      .replace('fa-volume-control-phone', 'fa-phone-volume')
      .replace('institution', 'fa-flag')
      .replace(/-([a-z])/g, function(g) { return g[1].toUpperCase() })
  }
}
