import { Component, Input, Output, EventEmitter } from '@angular/core'
import Model from 'src/app/core/model/model.class'
import * as _ from 'lodash'

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent {

  @Input('model') set model(value: Model) {
    this.items = _.clone(value.data)
  }
  @Input() labelAttribute = 'name'
  @Input() idAttribute = 'id'
  @Input() disabled = false

  @Output() selectionChange = new EventEmitter()

  items: any[]
  selectedIds: any[] = []

  constructor() { }

  toggleItemChecked(id: any) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(e => e !== id)
    } else {
      this.selectedIds.push(id)
    }
  }

}
