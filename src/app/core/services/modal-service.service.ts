import { Injectable } from '@angular/core'
import { ModalComponent } from '../components/modal/modal.component'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: ModalComponent[] = []
  public openModals: ModalComponent[] = []

  public message: string
  public messageTitle: string

  public confirmationMessage: string
  public confirmationCallback: () => void

  add(modal: ModalComponent) {
    this.modals.push(modal)
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id)
  }

  open(id: string) {
    let modal: ModalComponent = this.modals.find(item => item.id === id)
    modal.open()
  }

  close(id: string) {
    let modal: ModalComponent = this.modals.find(item => item.id === id)
    modal.close()
  }

  showError(err: any = null, message: string = '') {
    this.messageTitle = 'Hiba'
    if (err) {
      this.message = err.error.error
    } else if (message) {
      this.message = message
    }
    this.open('message')
  }

  showMessage(message: string) {
    this.messageTitle = 'Info'
    this.message = message
    this.open('message')
  }

  confirm(message: string, callback: () => void = () => {}) {
    this.confirmationMessage = message
    this.confirmationCallback = callback
    this.open('confirm')
  }
}
