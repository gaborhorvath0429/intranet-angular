import { Directive } from '@angular/core'
import { GridComponent, GridView } from '../grid.component'
import { Field, Filter, Sorter } from 'src/app/core/model/model.class'
import { GridViewService } from 'src/app/core/services/socket.service'

@Directive({
  selector: '[showSavedViews]',
  providers: [GridViewService]
})
export class SavedViewsDirective {

  constructor(host: GridComponent, gridViewService: GridViewService) {
    Object.assign(host, {
      savedViews: true,
      gridViewService,
      ngOnInit: this.initSavedViews.bind(host),
      createSavedView: this.createSavedView.bind(host),
      selectColumn: this.selectColumn.bind(host),
      isColumnSelected: this.isColumnSelected.bind(host),
      filterColumns: this.filterColumns.bind(host),
      selectView: this.selectView.bind(host),
      deleteSavedView: this.deleteSavedView.bind(host),
      onSaveNewViewButtonClick: this.onSaveNewViewButtonClick.bind(host),
      resetView: this.resetView.bind(host),
      applyView: this.applyView.bind(host)
    })
  }

  initSavedViews = function(): void {
    this.gridViewService.fromEvent('read').subscribe((views: GridView[]) => {
      this.savedViewCollection = views
    })

    this.gridViewService.emit('read', {
      module: this.module,
      view: 'grid'
    })
  }

  createSavedView = function(): void {
    let record = {
      name: this.savedViewName || this.selectedView.name,
      columns: this.selectedColumns.map((e: Field) => e.name),
      sorters: JSON.stringify(this.model.sorters),
      filters: JSON.stringify(this.model.filters)
    }
    if (this.selectedView) Object.assign(record, {id : this.selectedView.id})
    this.gridViewService.emit(this.selectedView ? 'update' : 'create', {
      module: this.module,
      view: 'grid',
      records: [record]
    })

    this.gridViewService.emit('read', {
      module: this.module,
      view: 'grid'
    })
    if (this.selectedView) {
      setTimeout(() => this.selectedView = this.savedViewCollection.find((e: GridView) => e.id === this.selectedView.id), 200)
    }
  }

  onSaveNewViewButtonClick = function(): void {
    this.createSavedView()
    this.savedViewName = ''
    this.modalService.close('viewSaveModal-' + this.module)
  }

  selectColumn = function(column: Field): void {
    if (this.selectedColumns.includes(column)) {
      this.selectedColumns = this.selectedColumns.filter((e: Field) => e !== column)
    } else {
      this.selectedColumns.push(column)
    }
  }

  isColumnSelected = function(column: Field): boolean {
    return this.selectedColumns.indexOf(column) > -1
  }

  applyView = function(): void {
    if (this.selectedView && (this.selectedView.filters !== '[]' || this.selectedView.sorters !== '[]')) {
      let filters = JSON.parse(this.selectedView.filters)
      let sorters = JSON.parse(this.selectedView.sorters)
      this.model.filters = filters
      this.model.sorters = sorters
      this.filterFields.clear()
      this.sorterFields.clear()
      filters.forEach((filter: Filter) => {
        this.filterFields.add(this.model.fields.find((field: Field) => field.name === filter.field))
      })
      sorters.forEach((sorter: Sorter) => {
        this.sorterFields.add(this.model.fields.find((field: Field) => field.name === sorter.field.name))
      })
      this.model.load()
    }
    this.filterColumns()
  }

  resetView = function(): void {
    if (this.model.filters.length || this.model.sorters.length) {
      this.model.filters = []
      this.model.sorters = []
      this.filterFields.clear()
      this.sorterFields.clear()
      this.model.load()
    }
    this.selectedColumns = []
    this.selectedView = null
    this.filterColumns()
  }

  filterColumns = function(): void {
    if (!this.selectedColumns.length) {
      this.hiddenColumns = []
    } else {
      this.hiddenColumns = this.model.fields.filter((e: Field) => !this.selectedColumns.includes(e))
    }
  }

  selectView = function(view: GridView): void {
    this.selectedView = view
    this.selectedColumns = []
    view.columns.forEach(column => this.selectedColumns.push(this.model.fields.find((e: Field) => e.name === column)))
  }

  deleteSavedView = function(): void {
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

}
