import { Component, Input, Output, EventEmitter } from '@angular/core'
import Model from 'src/app/core/model/model.class'
import * as _ from 'lodash'

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent {

  @Input('model') model: Model
  @Input() labelAttribute = 'name'
  @Input() idAttribute = 'id'
  @Input() disabled = false

  @Input() height: string
  @Input() wrap: boolean

  @Input() search = false

  @Output() selectionChange = new EventEmitter()

  searchText = ''

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
