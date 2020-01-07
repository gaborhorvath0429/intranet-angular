import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { PaymentModel } from '../model/payment'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { ApiResponse } from 'src/app/app.module'

interface PaymentFormValues {
  overPaymentCeid: number
  paymentDocId: number
  inclusionCeid: number
  inclusionDate: string
  inclusionAmount: number
  balance: number
}

@Injectable({
  providedIn: 'root'
})
export class OverpaymentInclusionService {
  constructor(
    private http: HttpClient,
    private paymentModel: PaymentModel
  ) {}

  exportCsv(params: any): void {
    let queryString = ''
    this.paymentModel.fields.forEach(field => {
      queryString += '&columns=' + field.displayName
    })
    Object.keys(params).forEach(param => {
      queryString += `&${param}=${params[param]}`
    })
    window.location.href = environment.apiUrl + '/overpaymentInclusion/exportCsv?' + queryString
  }

  getDocId(opCeid: string): Observable<{ paymentsDocId: string, amount: number }> {
    return this.http.get<{ paymentsDocId: string, amount: number }>(
      environment.apiUrl + '/overpaymentInclusion/getPaymentsDocumentId', { params: { opCeid }}
    )
  }

  getBalance(inclCeid: string): Observable<{ afterBalance: number }> {
    return this.http.get<{ afterBalance: number }>(
      environment.apiUrl + '/overpaymentInclusion/getOverpaymentAfterBalance', { params: { inclCeid }}
    )
  }

  savePayment(values: PaymentFormValues) {
    let params = {
      OP_INCLUSION_ID: 0,
      OP_CEID: values.overPaymentCeid,
      PAYMENTS_DOC_ID: values.paymentDocId,
      INCL_CEID: values.inclusionCeid,
      INCLUSION_DATE: values.inclusionDate,
      INCLUSION_AMOUNT: values.inclusionAmount,
      AFTER_INCLUSION_BALANCE: values.balance
    }

    return this.http.post<ApiResponse>(environment.apiUrl + '/overpaymentInclusion/overpaymentSave', { ...params })
  }
}
