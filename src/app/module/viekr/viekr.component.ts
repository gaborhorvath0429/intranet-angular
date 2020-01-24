import { Component, ViewChild, AfterContentInit } from '@angular/core'
import { IncomingModel } from './model/incoming'
import { GridComponent } from 'src/app/core/components/grid/grid.component'
import { UsersModel } from './model/users'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FormSubmit } from 'src/app/core/decorators/form-submit'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { ViekrService, AttachmentData } from './service/viekr.service'

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
    public usersModel: UsersModel,
    public service: ViekrService,
    public modalService: ModalService,
  ) { }

  @ViewChild(GridComponent) grid: GridComponent

  assignToUserForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    count: new FormControl(0, [Validators.min(0)]),
  })

  ngAfterContentInit(): void {
    this.assignToUserForm.get('count').valueChanges.subscribe(val => {
      if (val !== 0) this.grid.selection = []
    })
  }

  @FormSubmit('assignToUserForm')
  onAssignToUserFormSubmit(): void {
    if (!this.grid.selection.length && !this.assignToUserForm.controls.count.value) {
      this.modalService.showMessage('Válassz ki legalább egy elemet, vagy add meg az üzenetek számát!')
    } else {
      let { user, count } = this.assignToUserForm.value
      let userName = this.usersModel.data.find(e => e.id === user).name
      let selected = this.grid.selection
      this.modalService.confirm(
        `Biztosan hozzárendelsz <strong>${selected.length || count} db</strong> csatolmányt ${userName} felhasználóhoz?`,
        () => {
          this.incomingModel.loading = true
          this.service.assignToUser(user, selected, count).subscribe(() => {
            this.modalService.showMessage('Sikeres hozzárendelés!')
            this.incomingModel.load()
          })
        }
      )
    }
  }

  exportIncoming(): void {
    this.service.exportIncoming().subscribe(() => {
      this.modalService.showMessage('Az exportált adatokat tartalamazó fájlt elküldtük e-mailben.')
    })
  }

  onIncomingRowDoubleClick(row: any): void {
    this.service.getAttachmentData(row).subscribe((res: AttachmentData) => {
      this.attachmentData = res
      this.attachmentId = row.id
      this.modalService.open('viekrAttachment')
    }, () => {
      this.modalService.showError(null, 'Nincs adós az adott ügyhöz!')
    })
  }

  showNewMessageWindow(): void {
    this.modalService.open('viekrMessage')
  }

}
