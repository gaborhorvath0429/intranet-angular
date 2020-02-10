import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ViekrAttachmentCommentsModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = false

  proxy = {
    type: 'ajax',
    url: '/viekr/getComments',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'commentId',
    type: 'int'
  }, {
    name: 'createdBy',
    type: 'string',
    displayName: 'common.opid',
    width: 100
  }, {
    name: 'createdAt',
    type: 'date',
    displayName: 'Időpont',
    dateFormat: 'YYYY.MM.DD HH:m:s',
    width: 150
  }, {
    name: 'text',
    type: 'string',
    displayName: 'common.comment'
  } ]
}
