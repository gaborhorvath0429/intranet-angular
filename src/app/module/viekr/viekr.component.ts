import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { IncomingModel } from './model/incoming'
import { GridComponent } from 'src/app/core/components/grid/grid.component'
import { UsersModel } from './model/users'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { FormSubmit } from 'src/app/core/decorators/form-submit'

@Component({
  selector: 'app-viekr',
  templateUrl: './viekr.component.html',
  styleUrls: ['./viekr.component.scss']
})
export class ViekrComponent implements OnInit, AfterViewInit {

  constructor(
    public incomingModel: IncomingModel,
    public usersModel: UsersModel
  ) { }

  @ViewChild(GridComponent) grid: GridComponent

  assignToUserForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    count: new FormControl(1, [Validators.required, Validators.min(1)]),
  })

  @FormSubmit('assignToUserForm')
  onAssignToUserFormSubmit(): void {
    console.log(this.assignToUserForm.value)
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
