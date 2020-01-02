import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren,
  QueryList, ChangeDetectorRef, AfterViewChecked, AfterViewInit } from '@angular/core'
import { GridViewService } from '../../services/socket.service'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'
import { Observable, fromEvent } from 'rxjs'
import { ModalService } from '../../services/modal-service.service'
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component'
import { filter, map, tap } from 'rxjs/operators'
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
export class GridComponent implements OnInit, AfterViewChecked, AfterViewInit {

  @Input() module: string
  @Input() model: Model
  @Input() height?: number
  @Input() width?: number
  @Input() savedViews = false
  @Input() paginator = false

  public hasToolbar = false
  public showFilters = false

  // Attributes needed for saved views.
  public gridViewService: GridViewService
  public savedViewCollection: GridView[]
  public selectedColumns: Field[] = []
  public hiddenColumns: Field[] = []
  public selectedView: GridView
  public savedViewName = ''

  @ViewChild('table') table: ElementRef<HTMLTableElement>
  @ViewChildren('toolbarButton') toolbarButtons: QueryList<ToolbarButtonComponent>

  constructor(
    public modalService: ModalService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {} // overridden

  ngAfterViewChecked(): void {
    this.hasToolbar = this.paginator || Boolean(this.toolbarButtons.length)
    this.cdRef.detectChanges()
  }

  ngAfterViewInit(): void {
    $(this.table.nativeElement).resizableColumns()
    if (this.showFilters) this.initDragAndDrop()
  }

  initDragAndDrop(): void {
    let headers = document.getElementsByClassName('table-header')
    let label = document.getElementById('drag-label')
    let mouseisdown = false
    let startPos: { x: number, y: number}

    Array.from(headers).forEach((header: any) => {
      fromEvent(header, 'mousedown').subscribe((e: MouseEvent) => {
          mouseisdown = true
          label.innerHTML = header.textContent
          startPos = { x: e.offsetX, y: e.offsetY}
      })

      fromEvent(document, 'mouseup').pipe(
        filter(e => mouseisdown)
      ).subscribe((e: any) => {
        mouseisdown = false
        label.style.display = 'none'
        console.log(e.toElement)
      })

      fromEvent(document, 'mousemove').pipe(
          filter(e => mouseisdown),
          map((e: MouseEvent) => {
            return {
              left: e.clientX - startPos.x,
              top: e.clientY - startPos.y
            }
          }),
          tap(() => label.style.display = 'block')
      )
      .subscribe(p => {
        label.style.top = p.top + 30 + 'px'
        label.style.left = p.left + 50 + 'px'
      })
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

  // These methods are overridden by SavedViewsDirective
  createSavedView() {}
  selectColumn(column: Field) {}
  isColumnSelected(column: Field) {}
  filterColumns() {}
  selectView(view: GridView) {}
  deleteSavedView() {}
  onSaveNewViewButtonClick() {}
}
