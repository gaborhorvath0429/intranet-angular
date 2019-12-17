import { Component, OnInit, Input } from '@angular/core'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'
import { GridViewService } from '../../services/socket.service'

interface GridView {
  id: string
  name: string
  columns: string[]
  filters: string[]
  sorters: string[]
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() module: string
  @Input() model: Model
  @Input() height?: number
  @Input() width?: number
  @Input() savedViews?: boolean

  public savedViewCollection: GridView[]
  public selectedColumns: Field[] = []

  constructor(private gridViewService: GridViewService) { }

  ngOnInit(): void {
    if (this.savedViews) this.initSavedViews()
  }

  initSavedViews(): void {
    this.gridViewService.fromEvent('read').subscribe((views: GridView[]) => {
      console.log(views)
      this.savedViewCollection = views
    })

    this.gridViewService.emit('read', {
      module: this.module,
      view: 'grid'
    })
  }

  createSavedView(columns = [], sorters = [], filters = []): void {
    this.gridViewService.emit('create', {
      module: this.module,
      view: 'grid',
      records: [{
        name: 'mnvm',
        columns,
        sorters,
        filters
      }]
    })
  }

  selectColumn(column: Field): void {
    if (this.selectedColumns.includes(column)) {
      this.selectedColumns = this.selectedColumns.filter(e => e !== column)
    } else {
      this.selectedColumns.push(column)
    }
  }

  isColumnSelected(column: Field): boolean {
    return this.selectedColumns.indexOf(column) > -1
  }

  formatCellValue(value: any, column: Field): string | number {
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
