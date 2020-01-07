import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class IncomingModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    if (this.autoLoad) this.load()
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
    name: 'sorszam',
    type: 'int',
    displayName: 'Ü#',
    width: 50
  }, {
    name: 'csatolmany_id',
    type: 'int',
    displayName: 'D#',
    width: 50
  }, {
    name: 'beerkezes_datuma',
    type: 'date',
    displayName: 'Érkezett',
    dateFormat: 'YYYY-MM-DD'
  }, {
    name: 'statusz',
    type: 'string',
    displayName: 'Státusz'
  }, {
    name: 'status_id',
    type: 'int',
    displayName: ''
  }, {
    name: 'felado',
    type: 'string',
    displayName: 'Feladó'
  }, {
    name: 'beazonositas_id',
    type: 'int',
    displayName: ''
  }, {
    name: 'ceid',
    type: 'string',
    displayName: 'CEID'
  }, {
    name: 'subscriber',
    type: 'string',
    displayName: 'Adós'
  }, {
    name: 'subscriber_id',
    type: 'string',
    displayName: ''
  }, {
    name: 'felelos_id',
    type: 'int',
    displayName: ''
  }, {
    name: 'felelos',
    type: 'string',
    displayName: 'Felelős'
  }, {
    name: 'dokumentum_tipus',
    type: 'string',
    displayName: 'Dokumentum típusa'
  }, {
    name: 'hatarido',
    type: 'date',
    displayName: 'Határidő',
    dateFormat: 'YYYY-MM-DD'
  }, {
    name: 'jogi_felelos',
    type: 'string',
    displayName: 'Jogi felelős'
  }, {
    name: 'csatolmany_db',
    type: 'int',
    displayName: ''
  }, {
    name: 'vh_level_type',
    type: 'string',
    displayName: 'Levél VH-nak'
  }, {
    name: 'ownCase',
    type: 'string',
    displayName: ''
  }, {
    name: 'atadaskor_jogis',
    type: 'string',
    displayName: 'Átadáskor jogi'
  } ]
}
