import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { LetterTypesModel } from '../../model/letterTypes'
import { DocumentTypesModel } from '../../model/documentTypes'
import { SubscribersModel } from '../../model/subscribers'

@Component({
  selector: 'app-viekr-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnChanges {

  @Input() attachmentData: any

  constructor(
    public modalService: ModalService,
    public letterTypesModel: LetterTypesModel,
    public documentTypesModel: DocumentTypesModel,
    public subscribersModel: SubscribersModel
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes.attachmentData.currentValue
    if (data) this.subscribersModel.load(1, { ceid: data.rows.find(e => e.ceid !== null).ceid })
  }

}
