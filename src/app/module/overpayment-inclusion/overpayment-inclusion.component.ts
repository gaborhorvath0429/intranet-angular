import { Component, OnInit } from '@angular/core'
import { OverpaymentInclusionService } from './service/overpayment-inclusion.service'
import { PaymentModel } from './model/payment'

@Component({
  selector: 'app-overpayment-inclusion',
  templateUrl: './overpayment-inclusion.component.html',
  styleUrls: ['./overpayment-inclusion.component.scss']
})
export class OverpaymentInclusionComponent implements OnInit {

  constructor(
    private service: OverpaymentInclusionService,
    public paymentModel: PaymentModel
  ) { }

  ngOnInit() {
  }

}
