import { Component, OnInit, Input } from '@angular/core'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() model: Model
  @Input() height: number
  @Input() width: number

  constructor() { }

  ngOnInit() {
  }

  formatCellValue(value: any, column: Field) {
    switch (column.type) {
      case 'string':
        return value
      case 'int':
        return parseInt(value)
      case 'float':
        return value.toFixed(2)
      case 'date':
        return moment(new Date(value)).format(column.dateFormat)
      default:
        console.error('Unknown data type in model: ' + column.type)
    }
  }

}
