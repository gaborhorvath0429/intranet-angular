import { Component } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  constructor(
    public modalService: ModalService
  ) { }

}
