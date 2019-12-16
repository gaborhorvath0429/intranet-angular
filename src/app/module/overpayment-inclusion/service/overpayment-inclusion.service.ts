import { Injectable } from '@angular/core'
import PaymentModel from '../model/payment'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class OverpaymentInclusionService {
  constructor(private paymentModel: PaymentModel) { }
}
