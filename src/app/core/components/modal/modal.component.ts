import { Component, OnInit, Input, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core'
import { ModalService } from '../../services/modal-service.service'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string
  @Input() title: string
  @Input() width?: number
  @Input() height?: number
  @Input() fullScreen = false
  @Input() alignFooter = 'end'
  @Input() closeable = true
  @Output() onClose = new EventEmitter()

  private element: any
  public zIndex: number

  constructor(public modalService: ModalService, el: ElementRef) {
    this.element = el.nativeElement
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id')
      return
    }
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element)
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
    this.zIndex = 100 + (2 * this.modalService.openModals.length)
    this.modalService.openModals.push(this)
  }

  close(): void {
    this.element.style.display = 'none'
    document.body.classList.remove('modal-open')
    this.modalService.openModals = this.modalService.openModals.filter(e => e !== this)
    this.onClose.emit()
  }
}
