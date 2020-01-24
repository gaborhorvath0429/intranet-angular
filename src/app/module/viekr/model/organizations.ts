import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ViekrOrganizationsModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true

  proxy = {
    type: 'ajax',
    url: '/viekr/getOrganizations',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'szervezet_id'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'szervezet_nev'
  }, {
    name: 'organizationId',
    type: 'string',
    mapping: 'szervezet_azonosito'
  } ]
}
