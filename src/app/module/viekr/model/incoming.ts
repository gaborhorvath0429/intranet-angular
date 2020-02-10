import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { StatusModel } from './statuses'
import { DocumentTypesModel } from './documentTypes'

@Injectable({
  providedIn: 'root'
})
export class IncomingModel extends Model {
  constructor(
    http: HttpClient,
    private statusModel: StatusModel,
    private documentTypesModel: DocumentTypesModel
  ) {
    super(http)
    super.init()
  }

  autoLoad = true
  pageSize = 25

  proxy = {
    type: 'ajax',
    url: '/viekr/getAttachments',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'csatolmany_id'
  }, {
    name: 'sorszam',
    type: 'int',
    displayName: 'viekr.serialNumber',
    width: 50
  }, {
    name: 'csatolmany_id',
    type: 'int',
    displayName: 'viekr.attachmentId',
    width: 50
  }, {
    name: 'beerkezes_datuma',
    type: 'date',
    displayName: 'viekr.received',
    dateFormat: 'YYYY-MM-DD'
  }, {
    name: 'statusz',
    type: 'string',
    displayName: 'common.status',
    filterModel: {
      model: this.statusModel,
      filterAttribute: 'id',
      labelAttribute: 'name'
    }
  }, {
    name: 'status_id',
    type: 'int'
  }, {
    name: 'felado',
    type: 'string',
    displayName: 'viekr.sender'
  }, {
    name: 'beazonositas_id',
    type: 'int'
  }, {
    name: 'ceid',
    type: 'string',
    displayName: 'common.ceid'
  }, {
    name: 'subscriber',
    type: 'string',
    displayName: 'viekr.subscriber'
  }, {
    name: 'subscriber_id',
    type: 'string'
  }, {
    name: 'felelos_id',
    type: 'int'
  }, {
    name: 'felelos',
    type: 'string',
    displayName: 'viekr.responsible'
  }, {
    name: 'dokumentum_tipus',
    type: 'string',
    displayName: 'viekr.documentType',
    filterModel: {
      model: this.documentTypesModel,
      filterAttribute: 'name',
      labelAttribute: 'label'
    }
  }, {
    name: 'hatarido',
    type: 'date',
    displayName: 'viekr.dueDate',
    dateFormat: 'YYYY-MM-DD'
  }, {
    name: 'jogi_felelos',
    type: 'string',
    displayName: 'viekr.legalResponsible'
  }, {
    name: 'csatolmany_db',
    type: 'int'
  }, {
    name: 'vh_level_type',
    type: 'string',
    displayName: 'viekr.executorLetterType'
  }, {
    name: 'ownCase',
    type: 'string'
  }, {
    name: 'atadaskor_jogis',
    type: 'string',
    displayName: 'viekr.legalAtTransfer'
  } ]
}
