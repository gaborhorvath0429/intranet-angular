import { Component, OnInit, ViewChild } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { ViekrOrganizationsModel } from '../../model/organizations'
import { ViekrActionTypesModel } from '../../model/actionTypes'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { FormSubmit } from 'src/app/core/decorators/form-submit'
import { ViekrService, SubscriberDetails } from '../../service/viekr.service'
import { ComboBoxComponent } from 'src/app/core/components/input/combo-box/combo-box.component'
import { ViekrAttachmentSubscribersModel } from '../../model/subscribers'
import { OutgoingModel } from '../../model/outgoing'

@Component({
  selector: 'app-viekr-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class ViekrMessageComponent implements OnInit {

  public additionalAttachments: File[] = [null]
  public message = ''

  @ViewChild('debtorCombobox') debtorCombobox: ComboBoxComponent

  form = new FormGroup({
    elozmenyAzonosito: new FormControl(''),
    organizationId: new FormControl('', Validators.required),
    subscriberId: new FormControl('', Validators.required),
    vhNumber: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    ceids: new FormControl('', Validators.required),
    actionType: new FormControl('')
  })

  constructor(
    public service: ViekrService,
    public modalService: ModalService,
    public organizationsModel: ViekrOrganizationsModel,
    public actionTypesModel: ViekrActionTypesModel,
    public subscribersModel: ViekrAttachmentSubscribersModel,
    private outgoingModel: OutgoingModel
  ) { }

  ngOnInit(): void {
    this.form.get('ceids').valueChanges.subscribe(ceid => {
      if (ceid && ceid.length >= 8) {
        ceid = ceid.split(',').map((val: string) => val.match(/\d+/))[0]
        this.subscribersModel.load(1, { ceid }).then((data: SubscriberDetails[]) => {
          if (data.length) {
            this.debtorCombobox.disabled = false
            this.debtorCombobox.setData(data)
            this.debtorCombobox.selectItem(data[0])
          }
        })
      } else {
        this.debtorCombobox.disabled = true
        this.debtorCombobox.setData([])
        this.debtorCombobox.setValue('')
        this.form.get('vhNumber').setValue('')
      }
    })
    this.form.get('subscriberId').valueChanges.subscribe(subscriberId => {
      if (!this.form.get('ceids').value) return
      let ceid = this.form.get('ceids').value.split(',').map((val: string) => val.match(/\d+/))[0]
      if (subscriberId) this.service.getVhNumber(ceid, subscriberId).subscribe(({ executorCaseId }) => {
        this.form.get('vhNumber').setValue(executorCaseId)
      }, () => this.modalService.showError(null, 'Nincs VH ügyiratszám az ügyben.'))
    })
  }

  newAttachment(): void {
    this.additionalAttachments.push(null)
  }

  onFileInputChange(files: FileList, index: number): void {
    this.additionalAttachments[index] = files.item(0)
  }

  @FormSubmit('form')
  onFormSubmit(): void {
    if (!this.message && this.additionalAttachments.every(file => file === null) && !this.form.get('actionType').value) {
      this.modalService.showError(null, 'Az üzenet nem küldhető el üresen.')
    } else {
      this.service.sendMessage({...this.form.value, message: this.message, files: this.additionalAttachments}).subscribe(() => {
        this.modalService.showMessage('Üzenet sikeresen elküldve!')
        this.modalService.close('viekrMessage')
        this.outgoingModel.load()
      })
    }
  }

}
