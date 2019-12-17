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
  public hiddenColumns: Field[] = []
  public selectedView: GridView

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

  createSavedView(): void {
    let sorters = []
    let filters = []
    this.gridViewService.emit('create', {
      module: this.module,
      view: 'grid',
      records: [{
        name: 'test',
        columns: this.selectedColumns.map(e => e.name),
        sorters,
        filters
      }]
    })

    this.gridViewService.emit('read', {
      module: this.module,
      view: 'grid'
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

  filterColumns(): void {
    if (!this.selectedColumns.length) {
      this.hiddenColumns = []
    } else {
      this.hiddenColumns = this.model.fields.filter(e => !this.selectedColumns.includes(e))
    }
  }

  selectView(view: GridView): void {
    this.selectedView = view
    this.selectedColumns = []
    view.columns.forEach(column => this.selectedColumns.push(this.model.fields.find(e => e.name === column)))
  }

  deleteSavedView(): void {
    this.gridViewService.emit('destroy', {
      module: this.module,
      view: 'grid',
      records: [{ id: this.selectedView.id }]
    })
    this.selectedView = null
    this.gridViewService.emit('read', {
      module: this.module,
      view: 'grid'
    })
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
