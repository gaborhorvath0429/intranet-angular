import { Component, OnInit } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  constructor(
    public modalService: ModalService
  ) { }

}
