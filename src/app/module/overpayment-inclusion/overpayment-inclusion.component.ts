import { Component, OnInit, ViewChild } from '@angular/core'
import { OverpaymentInclusionService } from './service/overpayment-inclusion.service'
import { PaymentModel } from './model/payment'
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker'
import { GridComponent } from 'src/app/core/components/grid/grid.component'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FormSubmit } from 'src/app/core/decorators/form-submit'

@Component({
  selector: 'app-overpayment-inclusion',
  templateUrl: './overpayment-inclusion.component.html',
  styleUrls: ['./overpayment-inclusion.component.scss']
})
export class OverpaymentInclusionComponent implements OnInit {

  dpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'yyyy.mm.dd'
  }

  opCeid: number
  inclCeid: number

  inclusionDateFrom: IMyDateModel
  inclusionDateTo: IMyDateModel

  newOverPaymentForm = new FormGroup({
    overPaymentCeid: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    paymentDocId: new FormControl('', [Validators.required]),
    inclusionCeid: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    inclusionDate: new FormControl('', [Validators.required]),
    inclusionAmount: new FormControl('', [Validators.required, Validators.min(0)]),
    balance: new FormControl('', [Validators.required, Validators.min(0)])
  })

  @ViewChild(GridComponent) grid: GridComponent

  constructor(
    private service: OverpaymentInclusionService,
    public paymentModel: PaymentModel,
    public modalService: ModalService
  ) { }

  ngOnInit() {
    // when overpayment ceid is 8 char long, we get and fill the payments doc id and amount.
    this.newOverPaymentForm.get('overPaymentCeid').valueChanges.subscribe(val => {
      if (val.length === 8) this.service.getDocId(val).subscribe(response => {
        this.newOverPaymentForm.get('paymentDocId').setValue(response.paymentsDocId)
        this.newOverPaymentForm.get('inclusionAmount').setValue(response.amount)
      }, () => this.modalService.showError(null, 'Az adott ügyben nincs tartozás!'))
    })

    this.newOverPaymentForm.get('inclusionCeid').valueChanges.subscribe(val => {
      if (val.length === 8) this.service.getBalance(val).subscribe(response => {
        this.newOverPaymentForm.get('balance').setValue(response.afterBalance)
      }, () => this.modalService.showError(null, 'Érvénytelen beszámításos CEID!'))
    })
  }

  get searchParams() {
    return {
      opCeid: this.opCeid ? this.opCeid : '',
      inclCeid: this.inclCeid ? this.inclCeid : '',
      dateFrom: this.inclusionDateFrom ? this.inclusionDateFrom.singleDate.formatted : '',
      dateTo: this.inclusionDateTo ? this.inclusionDateTo.singleDate.formatted : ''
    }
  }

  search(): void {
    this.paymentModel.load(1, this.searchParams)
  }

  exportCsv(): void {
    this.service.exportCsv(this.searchParams)
  }

  @FormSubmit('newOverPaymentForm')
  onNewOverPaymentSubmit(): void {
    this.service.savePayment(this.newOverPaymentForm.value).subscribe(() => {
      this.modalService.showMessage('Tétel sikeresen létrehozva!')
      this.newOverPaymentForm.reset()
      this.modalService.close('newOverPayment')
      this.paymentModel.load()
    })
  }
}
