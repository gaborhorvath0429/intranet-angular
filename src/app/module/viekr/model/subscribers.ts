import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SubscribersModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = false

  proxy = {
    type: 'ajax',
    url: '/viekr/getSubscribers',
    reader: {
      root: 'root',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'id',
    type: 'int',
    mapping: 'subscriberId'
  }, {
    name: 'name',
    type: 'string',
    mapping: 'subscriberName',
    convert(record: any, value: string) {
      let name = value

      if (record.mainDebtor === 1) {
        name += ' (main)'
      }

      if (record.subscriberIsDead === 1) {
        name += ' (elhunyt)'
      }

      return name
    }
  }, {
    name: 'ceid',
    type: 'int'
  }, {
    name: 'closingCode',
    type: 'string'
  }, {
    name: 'unifiedCases',
    type: 'int'
  }, {
    name: 'zone',
    type: 'string'
  }, {
    name: 'clientName',
    type: 'string'
  }, {
    name: 'subscriberId',
    type: 'int'
  }, {
    name: 'mainDebtor',
    type: 'int'
  }, {
    name: 'subscriberIsDead',
    type: 'int'
  } ]
}
