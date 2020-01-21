import { Component, Input, OnChanges, SimpleChanges,
  ViewChildren, QueryList, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { LetterTypesModel } from '../../model/letterTypes'
import { DocumentTypesModel } from '../../model/documentTypes'
import { ViekrAttachmentSubscribersModel } from '../../model/subscribers'
import { ComboBoxComponent } from 'src/app/core/components/input/combo-box/combo-box.component'
import { AttachmentData, Subscriber, SubscriberDetails, ViekrService } from '../../service/viekr.service'
import { CheckboxGroupComponent } from 'src/app/core/components/input/checkbox-group/checkbox-group.component'
import { ViekrAttachmentCommentsModel } from '../../model/comments'
import { IncomingModel } from '../../model/incoming'

@Component({
  selector: 'app-viekr-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnChanges {

  @Input() attachmentData: AttachmentData
  @Input() attachmentId: number

  @ViewChild('documentTypes') documentTypesGroup: CheckboxGroupComponent
  @ViewChildren('debtorCombobox') debtorComboboxes: QueryList<ComboBoxComponent>
  @ViewChildren('debtorCeidInput') ceidInputs: QueryList<ElementRef<HTMLInputElement>>
  @ViewChildren('subscriberDescription') subscriberDescriptions: QueryList<ElementRef<HTMLSpanElement>>

  public subscribers: Subscriber[]
  public lockedBy: string

  constructor(
    private cdRef: ChangeDetectorRef,
    public service: ViekrService,
    public modalService: ModalService,
    public letterTypesModel: LetterTypesModel,
    public documentTypesModel: DocumentTypesModel,
    public subscribersModel: ViekrAttachmentSubscribersModel,
    public commentsModel: ViekrAttachmentCommentsModel,
    public incomingModel: IncomingModel
  ) { }

  save(): void {
    console.log('SAVE')
    this.incomingModel.load()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscribers = []
    let data = changes.attachmentData.currentValue as AttachmentData
    if (data) {
      data.rows.filter((e: Subscriber) => e.ceid !== null).forEach((row, index) => {
        this.subscribers.push(row)
        this.setDebtorData(row.ceid, index)
      })
      this.cdRef.detectChanges() // we need this because checkboxgroup component does not necessarily exist yet
      this.documentTypesGroup.selectedIds = []
      data.rows.forEach((e: Subscriber) => {
        if (e.doctypeId) this.documentTypesGroup.selectedIds.push(e.doctypeId)
      })
      this.commentsModel.load(1, { attachment_id: this.attachmentId })
    }
  }

  debtorComboboxChange(item: SubscriberDetails, index: number): void {
    let description = this.subscriberDescriptions.toArray()[index]
    let descriptionValue = ''
    descriptionValue += item.closingCode ? `lezárt (${item.closingCode}); ` : 'nyitott; '
    descriptionValue += item.unifiedCases ? 'egyesített; ' : ''
    descriptionValue += item.zone + '; '
    descriptionValue += item.clientName
    description.nativeElement.innerHTML = descriptionValue
  }

  setDebtorData(ceid: number, index: number) {
    this.subscribersModel.load(1, { ceid }).then((data: SubscriberDetails[]) => {
      let combobox = this.debtorComboboxes.toArray()[index]
      let ceidInput = this.ceidInputs.toArray()[index]
      combobox.setData(data)
      combobox.selectItem(data[0])
      ceidInput.nativeElement.value = ceid.toString()
    })
  }

  onCeidChange(value: string, index: number) {
    if (value.length === 8) {
      this.setDebtorData(Number(value), index)
    }
  }

  get isDisabled(): boolean {
    return ![0, 4, 5].includes(this.attachmentData.status)
  }

}
