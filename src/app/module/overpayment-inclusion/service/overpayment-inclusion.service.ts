import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { PaymentModel } from '../model/payment'

@Injectable({
  providedIn: 'root'
})
export class OverpaymentInclusionService {
  constructor(private paymentModel: PaymentModel) { }
}
