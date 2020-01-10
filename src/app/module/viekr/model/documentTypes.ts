import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    if (this.autoLoad && !this.data.length) this.load()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getDocTypes',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'DOCUMENT_TYPE_ID'
  }, {
    name: 'description',
    type: 'string',
    mapping: 'DESCRIPTION'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'NAME'
  }, {
    name: 'label',
    type: 'string',
    convert(record: any) {
      return record.name + ' - ' + record.description
    }
  }, {
    name: 'value',
    type: 'string',
    mapping: 'NAME'
  }]
}
