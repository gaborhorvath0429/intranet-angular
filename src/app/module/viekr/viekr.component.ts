import { Component, ViewChild, AfterContentInit } from '@angular/core'
import { IncomingModel } from './model/incoming'
import { GridComponent } from 'src/app/core/components/grid/grid.component'
import { UsersModel } from './model/users'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FormSubmit } from 'src/app/core/decorators/form-submit'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { ViekrService, AttachmentData, ReplyDetails } from './service/viekr.service'
import { ViekrMessageComponent } from './window/message/message.component'
import { OutgoingModel } from './model/outgoing'
import { SentModel } from './model/sent'

@Component({
  selector: 'app-viekr',
  templateUrl: './viekr.component.html',
  styleUrls: ['./viekr.component.scss']
})
export class ViekrComponent implements AfterContentInit {

  attachmentData: AttachmentData
  attachmentId: number

  constructor(
    public incomingModel: IncomingModel,
    public outgoingModel: OutgoingModel,
    public usersModel: UsersModel,
    public service: ViekrService,
    public modalService: ModalService,
    public sentModel: SentModel
  ) { }

  @ViewChild('incomingGrid') incomingGrid: GridComponent
  @ViewChild('outgoingGrid') outgoingGrid: GridComponent
  @ViewChild(ViekrMessageComponent) messageWindow: ViekrMessageComponent

  assignToUserForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    count: new FormControl(0, [Validators.min(0)]),
  })

  ngAfterContentInit(): void {
    this.assignToUserForm.get('count').valueChanges.subscribe(val => {
      if (val !== 0) this.incomingGrid.selection = []
    })
  }

  @FormSubmit('assignToUserForm')
  onAssignToUserFormSubmit(): void {
    if (!this.incomingGrid.selection.length && !this.assignToUserForm.controls.count.value) {
      this.modalService.showMessage('viekr.pleaseSelectAtLeastOneItemOrEnterMessage')
    } else {
      let { user, count } = this.assignToUserForm.value
      let userName = this.usersModel.data.find(e => e.id === user).name
      let selected = this.incomingGrid.selection
      this.modalService.confirm(
        'viekr.assignConfirmation',
        () => {
          this.incomingModel.loading = true
          this.service.assignToUser(user, selected, count).subscribe(() => {
            this.modalService.showMessage('viekr.assigningSuccess')
            this.incomingModel.load()
          })
        },
        { count: selected.length || count, user: userName }
      )
    }
  }

  exportIncoming(): void {
    this.service.exportIncoming().subscribe(() => {
      this.modalService.showMessage('viekr.exportedFileSent')
    })
  }

  exportOutgoing(): void {
    this.service.exportOutgoing().subscribe(() => {
      this.modalService.showMessage('viekr.exportedFileSent')
    })
  }

  exportSent(): void {
    this.service.exportSent().subscribe(() => {
      this.modalService.showMessage('viekr.exportedFileSent')
    })
  }

  blockOutgoing(): void {
    if (!this.outgoingGrid.selection.length) {
      this.modalService.showError(null, 'viekr.pleaseSelectAtLeastOneItem')
    } else {
      this.service.blockOutgoing(this.outgoingGrid.selection[0].id).subscribe(() => {
        this.modalService.showMessage('viekr.blockingSuccess')
        this.outgoingModel.load()
      })
    }
  }

  onIncomingRowDoubleClick(row: any): void {
    this.service.getAttachmentData(row).subscribe((res: AttachmentData) => {
      this.attachmentData = res
      this.attachmentId = row.id
      this.modalService.open('viekrAttachment')
    })
  }

  showNewMessageWindow(replyDetails: ReplyDetails = null): void {
    this.messageWindow.form.reset()
    this.messageWindow.additionalAttachments = [null]
    this.messageWindow.message = ''
    if (replyDetails) {
      let form = this.messageWindow.form
      form.get('elozmenyAzonosito').setValue(replyDetails['ELOZMENYAZONOSITO'])
      form.get('organizationId').setValue(replyDetails['SZERVEZET_ID'])
      form.get('ceids').setValue(replyDetails['CEID'])
      form.get('subscriberId').setValue(replyDetails['SUBSCRIBER_ID'])
    }
    this.modalService.open('viekrMessage')
  }

  replyMessage(): void {
    if (!this.incomingGrid.selection.length) {
      this.modalService.showError(null, 'viekr.pleaseSelectAnItem')
    } else {
      this.service.fetchMessage(this.incomingGrid.selection[0].id).subscribe((data: ReplyDetails) => {
        this.showNewMessageWindow(data)
      })
    }
  }

}
