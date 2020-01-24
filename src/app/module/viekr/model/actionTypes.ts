import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ViekrActionTypesModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getActionTypes',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'action_id'
  }, {
    name: 'name',
    type: 'string'
  } ]
}
