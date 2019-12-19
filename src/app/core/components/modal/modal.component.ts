import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core'
import { ModalService } from '../../services/modal-service.service'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string
  @Input() title: string
  private element: any

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id')
      return
    }

    let modal = this
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element)
    // close modal on background click
    this.element.addEventListener('click', function(e: any) {
        if (e.target.className === 'modal') {
            modal.close()
        }
    })
    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this)
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id)
    this.element.remove()
  }

  open(): void {
    this.element.style.display = 'block'
    document.body.classList.add('modal-open')
  }

  close(): void {
    this.element.style.display = 'none'
    document.body.classList.remove('modal-open')
  }
}
