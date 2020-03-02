import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GroupsModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true
  pageSize = 25

  proxy = {
    type: 'ajax',
    url: '/regulation/group/0',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [{
    name: 'id',
    type: 'int',
    mapping: 'ID'
  }, {
    name: 'label',
    type: 'string',
    mapping: 'DESCRIPTION'
  }, {
    name: 'value',
    type: 'int',
    mapping: 'ID'
  }, {
    name: 'selected',
    type: 'int',
    mapping: 'HAS_ACCESS'
  }]
}
