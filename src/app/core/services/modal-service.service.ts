import { Injectable } from '@angular/core'
import { ModalComponent } from '../components/modal/modal.component'

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: ModalComponent[] = []

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
}
