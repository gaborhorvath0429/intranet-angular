import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SentModel extends Model {
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
    url: '/viekr/getSent',
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
    displayName: 'viekr.packageId',
    type: 'int'
  }, {
    name: 'szervezet',
    displayName: 'viekr.executor',
    type: 'string'
  }, {
    name: 'azonosito',
    displayName: 'viekr.messageId',
    type: 'string'
  }, {
    name: 'viekrAzonosito',
    displayName: 'viekr.viekrId',
    type: 'string'
  }, {
    name: 'creationDate',
    displayName: 'viekr.created',
    type: 'date'
  }, {
    name: 'createdBy',
    displayName: 'viekr.createdBy',
    type: 'string'
  }, {
    name: 'ceid',
    displayName: 'common.ceid',
    type: 'int'
  }, {
    name: 'name',
    displayName: 'common.subscriber',
    type: 'string'
  }, {
    name: 'feldolgozasistatusz',
    displayName: 'common.status',
    type: 'string'
  }, {
    name: 'postDate',
    displayName: 'viekr.sent',
    type: 'date'
  }, {
    name: 'deliveryDate',
    displayName: 'viekr.delivered',
    type: 'date'
  } ]
}
