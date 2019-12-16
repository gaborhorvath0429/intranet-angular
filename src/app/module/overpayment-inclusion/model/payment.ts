import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export default class PaymentModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    if (this.autoLoad) this.load()
  }

  autoLoad = true
  pageSize = 25

  proxy = {
    type: 'ajax',
    url: 'overpaymentInclusion/overpaymentSearch',
    reader: {
      root: 'result',
      totalProperty: 'totalCount'
    }
  }

  fields = [ {
    name: 'OP_INCLUSION_ID',
    displayName: 'Beszámítás azonosító',
    type: 'int',
    useNull: true
  }, {
    name: 'OP_CEID',
    displayName: 'Túlfizetéses CEID',
    type: 'int',
    useNull: true
  }, {
    name: 'INCL_CEID',
    displayName: 'Beszámításos CEID',
    type: 'int',
    useNull: true
  }, {
    name: 'INCLUSION_DATE',
    displayName: 'Beszámítás dátuma',
    type: 'date',
    dateFormat: 'Y.m.d',
    submitFormat: 'Y.m.d'
  }, {
    name: 'INCLUSION_AMOUNT',
    displayName: 'Beszámítás összege',
    type: 'float',
    useNull: true
  }, {
    name: 'AFTER_INCLUSION_BALANCE',
    displayName: 'Beszámítás utáni egyenleg',
    type: 'float',
    useNull: true
  } ]
}
