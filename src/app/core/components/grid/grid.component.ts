import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'
import { GridViewService } from '../../services/socket.service'
declare var $: any

export interface GridView {
  id?: string
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
export class GridComponent implements OnInit, AfterViewInit {

  @Input() module: string
  @Input() model: Model
  @Input() height?: number
  @Input() width?: number
  @Input() savedViews = false

  public savedViewCollection: GridView[]
  public selectedColumns: Field[] = []
  public hiddenColumns: Field[] = []
  public selectedView: GridView

  @ViewChild('table') table: ElementRef

  constructor(public gridViewService: GridViewService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(this.table.nativeElement).resizableColumns()
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

  // These methods are overridden by SavedViewsDirective
  createSavedView(): void {}
  selectColumn(column: Field): void {}
  isColumnSelected(column: Field) {}
  filterColumns(): void {}
  selectView(view: GridView): void {}
  deleteSavedView(): void {}
}
