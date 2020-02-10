import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PaymentModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  autoLoad = true
  pageSize = 25

  proxy = {
    type: 'ajax',
    url: '/overpaymentInclusion/overpaymentSearch',
    reader: {
      root: 'result',
      totalProperty: 'totalCount'
    }
  }

  fields = [{
    name: 'OP_INCLUSION_ID',
    displayName: 'overpaymentInclusion.inclusionId',
    type: 'int'
  }, {
    name: 'OP_CEID',
    displayName: 'overpaymentInclusion.overpaymentCeid',
    type: 'int'
  }, {
    name: 'INCL_CEID',
    displayName: 'overpaymentInclusion.inclusionCeid',
    type: 'int'
  }, {
    name: 'INCLUSION_DATE',
    displayName: 'overpaymentInclusion.inclusionDate',
    type: 'date',
    dateFormat: 'YYYY.MM.DD'
  }, {
    name: 'INCLUSION_AMOUNT',
    displayName: 'overpaymentInclusion.inclusionAmount',
    type: 'float'
  }, {
    name: 'AFTER_INCLUSION_BALANCE',
    displayName: 'overpaymentInclusion.balanceAfterInclusion',
    type: 'float'
  }]
}
