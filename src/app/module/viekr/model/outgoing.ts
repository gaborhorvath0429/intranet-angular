import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class OutgoingModel extends Model {
  constructor(
    http: HttpClient
  ) {
    super(http)
    super.init()
  }

  autoLoad = true
  pageSize = 25

  proxy = {
    type: 'ajax',
    url: '/viekr/getOutgoing',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'kuldemenyId'
  }, {
    name: 'kuldemenyId',
    displayName: 'K#',
    type: 'int'
  }, {
    name: 'szervezet',
    displayName: 'VH neve',
    type: 'string'
  }, {
    name: 'azonosito',
    displayName: 'Üzenetazonosító',
    type: 'string'
  }, {
    name: 'viekrAzonosito',
    displayName: 'VIEKR azonosító',
    type: 'string'
  }, {
    name: 'createdBy',
    displayName: 'Létrehozó',
    type: 'string'
  }, {
    name: 'ceid',
    displayName: 'CEID',
    type: 'int'
  }, {
    name: 'name',
    displayName: 'Adós',
    type: 'string'
  }, {
    name: 'feldolgozasistatusz',
    displayName: 'Státusz',
    type: 'string'
  }, {
    name: 'creationDate',
    displayName: 'Létrehozva',
    type: 'date'
  } ]
}
