import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class StatusModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    if (this.autoLoad && !this.data.length) this.load()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getStatuses',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'status_id'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'status_name'
  }, {
    name: 'label',
    type: 'string',
    mapping: 'status_name'
  }, {
    name: 'value',
    type: 'int',
    mapping: 'status_id'
  }]
}
