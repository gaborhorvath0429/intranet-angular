import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsersModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    if (this.autoLoad && !this.data.length) this.load()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getUsers',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'idusr'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'displayname'
  }]
}
