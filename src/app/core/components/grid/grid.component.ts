import { Component, Input, ViewChild, ElementRef, ViewChildren,
  QueryList, ChangeDetectorRef, AfterViewChecked, AfterViewInit, ContentChild, OnInit, ContentChildren } from '@angular/core'
import { GridViewService } from '../../services/socket.service'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'
import { fromEvent } from 'rxjs'
import { ModalService } from '../../services/modal-service.service'
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component'
import { filter, map } from 'rxjs/operators'
import { faSortAmountDown, faSortAmountDownAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
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
  @Input() searchParams?: any
  @Input() height?: number
  @Input() width?: number
  @Input() rowWidth?: number
  @Input() savedViews = false
  @Input() paginator = false

  public hasToolbar = false
  public showFilters = false
  public sorterFields = new Set<Field>()
  public filterFields = new Set<Field>()
  public selectedFilterField: Field
  public selectedFilterType = 'value'
  public filterNumberValue: number | ''
  public filterTextValue = ''
  public filterLtValue = ''
  public filterGtValue = ''

  // Icons
  public faTimesCircle = faTimesCircle
  public faSortAmountDown = faSortAmountDown
  public faSortAmountDownAlt = faSortAmountDownAlt

  // Attributes needed for saved views.
  public gridViewService: GridViewService
  public savedViewCollection: GridView[]
  public selectedColumns: Field[] = []
  public hiddenColumns: Field[] = []
  public selectedView: GridView
  public savedViewName = ''

  @ViewChild('table') table: ElementRef<HTMLTableElement>
  @ContentChildren('toolbarButton') toolbarButtons: QueryList<ToolbarButtonComponent>
  @ContentChild('topToolbar') topToolbarContent: ElementRef

  constructor(
    public modalService: ModalService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

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
    let draggingField = null
    let startPos: { x: number, y: number}

    Array.from(headers).forEach(header => {
      fromEvent(header, 'mousedown').subscribe((e: MouseEvent) => {
          mouseisdown = true
          draggingField = label.innerHTML = header.textContent
          startPos = { x: e.offsetX, y: e.offsetY}
          label.style.display = 'block'
      })

      fromEvent(document, 'mouseup').pipe(
        filter(e => mouseisdown)
      ).subscribe((e: any) => {
        mouseisdown = false
        label.style.display = 'none'
        if (e.toElement.classList.contains('filters')) {
          this.filterFields.add(this.model.fields.find(field => field.displayName === draggingField))
        } else if (e.toElement.classList.contains('sorters')) {
          this.sorterFields.add(this.model.fields.find(field => field.displayName === draggingField))
        }
      })

      fromEvent(document, 'mousemove').pipe(
        filter(e => mouseisdown),
        map((e: MouseEvent) => {
          return {
            left: e.clientX - startPos.x,
            top: e.clientY - startPos.y
          }
        })
      )
      .subscribe(p => {
        label.style.top = p.top + 30 + 'px'
        label.style.left = p.left + 50 + 'px'
      })
    })
  }

  sortBy(field: Field): void {
    let existingSorter = this.model.sorters.find(e => e.field === field)
    if (!existingSorter) {
      this.model.sorters.push({field, type: 'ASC'})
    } else if (existingSorter.type === 'ASC') {
      existingSorter.type = 'DESC'
    } else {
      existingSorter.type = 'ASC'
    }
    this.model.load(1, this.searchParams)
  }

  showFilterWindow(field: Field): void {
    let existingFilters = this.model.filters.filter(e => e.field === field.name)
    if (existingFilters.length) {
      for (let filter of existingFilters) {
        if (filter.data.type === 'empty' && filter.data.value === true) this.selectedFilterType = 'empty'
        if (filter.data.type === 'empty' && filter.data.value === false) this.selectedFilterType = 'not-empty'
        if (filter.data.comparison === 'eq') this.filterNumberValue = filter.data.value
        if (filter.data.comparison === 'lt') this.filterLtValue = filter.data.value
        if (filter.data.comparison === 'gt') this.filterGtValue = filter.data.value
        if (filter.data.type === 'string') this.filterTextValue = filter.data.value
      }
    } else {
      this.filterGtValue = ''
      this.filterLtValue = ''
      this.filterTextValue = ''
      this.filterNumberValue = ''
    }
    this.selectedFilterField = field
    this.modalService.open('gridFilterModal')
  }

  deleteSort(field: Field): void {
    this.sorterFields.delete(field)
    this.model.deleteSort(field)
    this.model.load(1, this.searchParams)
  }

  deleteFilter(field: Field): void {
    this.filterFields.delete(field)
    this.model.deleteFilter(field)
    this.model.load(1, this.searchParams)
  }

  onFilterButtonClick(): void {
    let filters = []
    let field = this.selectedFilterField
    switch (field.type) {
      case 'string':
        switch (this.selectedFilterType) {
          case 'value':
            filters.push({field: field.name, data: {type: 'string', mode: 'value', value: this.filterTextValue}})
            break
          case 'empty':
            filters.push({field: field.name, data: {type: 'empty', value: true}})
            break
          case 'not-empty':
            filters.push({field: field.name, data: {type: 'empty', value: false}})
            break
        }
        break
      case 'int':
        switch (this.selectedFilterType) {
          case 'value':
            if (this.filterNumberValue)
              filters.push({field: field.name, data: {type: 'numeric', mode: 'value', value: this.filterNumberValue, comparison: 'eq'}})
            if (this.filterLtValue)
              filters.push({field: field.name, data: {type: 'numeric', mode: 'value', value: this.filterLtValue, comparison: 'lt'}})
            if (this.filterGtValue)
              filters.push({field: field.name, data: {type: 'numeric', mode: 'value', value: this.filterGtValue, comparison: 'gt'}})
            break
          case 'empty':
            filters.push({field: field.name, data: {type: 'empty', value: true}})
            break
          case 'not-empty':
            filters.push({field: field.name, data: {type: 'empty', value: false}})
            break
        }
    }

    this.model.addFilters(filters)
    this.model.load(1, this.searchParams)
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
