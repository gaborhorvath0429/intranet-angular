import { Component, Input, ViewChild, ElementRef, QueryList, ChangeDetectorRef,
  AfterViewChecked, AfterViewInit, ContentChild, OnInit, ContentChildren, Output, EventEmitter } from '@angular/core'
import { GridViewService } from '../../services/socket.service'
import Model, { Field } from '../../model/model.class'
import * as moment from 'moment'
import { ModalService } from '../../services/modal-service.service'
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component'
import { faSortAmountDown, faSortAmountDownAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker'
import * as _ from 'lodash'
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

  // datepicker options
  dpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'yyyy.mm.dd'
  }

  @Input() module: string
  @Input() model: Model
  @Input() searchParams?: any
  @Input() height?: number
  @Input() width?: number
  @Input() rowWidth?: number
  @Input() savedViews = false
  @Input() paginator = false
  @Input() selectionModel: 'single' | 'checkbox' = 'single'
  @Output() rowDoubleClick = new EventEmitter<any>()

  public selection: any[] = []
  public hasToolbar = false

  // Attributes needed for filters and sorters
  public showFilters = false
  public sorterFields = new Set<Field>()
  public filterFields = new Set<Field>()
  public selectedFilterField: Field
  public selectedFilterType = 'value'
  public filterNumberValue: number | ''
  public filterDateValue: IMyDateModel
  public filterDateLtValue: IMyDateModel
  public filterDateGtValue: IMyDateModel
  public filterTextValue = ''
  public filterLtValue = ''
  public filterGtValue = ''
  public listFilterItems: { [id: string]: boolean }[] = []
  public filterListSearch = ''

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
    this.model.data$.subscribe(() => this.selection = [])
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
        return value ? moment(new Date(value)).format(column.dateFormat) : ''
      default:
        console.error('Unknown data type in model: ' + column.type)
    }
  }

  selectRow(row: any): void {
    switch (this.selectionModel) {
      case 'single':
        this.selection = [row]
        return
      case 'checkbox':
        if (this.selection.includes(row)) {
          this.selection = this.selection.filter(e => e !== row)
        } else {
          this.selection.push(row)
        }
        return
    }
  }

  isRowSelected(row: any): boolean {
    return this.selection.includes(row)
  }

  selectAll(): void {
    if (this.isAllSelected) {
      this.selection = []
    } else {
      this.selection = _.clone(this.model.data)
    }
  }

  get isAllSelected(): boolean {
    return this.selection.length && this.selection.length === this.model.data.length
  }

  // These methods are overridden by FiltersDirective
  initDragAndDrop(): void {}
  sortBy(field: Field): void {}
  showFilterWindow(field: Field): void {}
  deleteSort(field: Field): void {}
  deleteFilter(field: Field): void {}
  onFilterButtonClick(): void {}
  onRemoveFilterButtonClick(): void {}
  toggleListFilterItem(id: string): void {}
  isFilterListItemChecked(item: any): void {}


  // These methods are overridden by SavedViewsDirective
  createSavedView() {}
  selectColumn(column: Field) {}
  isColumnSelected(column: Field) {}
  filterColumns() {}
  selectView(view: GridView) {}
  deleteSavedView() {}
  onSaveNewViewButtonClick() {}
}
