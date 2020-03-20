import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FileUploadFormsModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/fileUploader/getForms',
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
    name: 'title',
    type: 'string',
    mapping: 'TITLE'
  }, {
    name: 'ACTION_TEXT',
    type: 'string'
  }, {
    name: 'CONFIRM_MESSAGE',
    type: 'string'
  }, {
    name: 'await',
    type: 'int',
    mapping: 'AWAIT'
  }]
}
