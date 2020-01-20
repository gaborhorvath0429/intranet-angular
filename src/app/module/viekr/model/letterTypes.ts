import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LetterTypesModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getVhLevelTypes',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'typeId'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'text'
  }]
}
