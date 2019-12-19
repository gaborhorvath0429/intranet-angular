import { Directive } from '@angular/core'
import { GridComponent, GridView } from '../grid.component'
import { Field } from 'src/app/core/model/model.class'
import { GridViewService } from 'src/app/core/services/socket.service'

@Directive({
  selector: '[showSavedViews]'
})
export class SavedViewsDirective {

  constructor(host: GridComponent, gridViewService: GridViewService) {
    host.savedViews = true
    host.gridViewService = gridViewService
    host.ngOnInit = this.initSavedViews.bind(host)
    host.createSavedView = this.createSavedView.bind(host)
    host.selectColumn = this.selectColumn.bind(host)
    host.isColumnSelected = this.isColumnSelected.bind(host)
    host.filterColumns = this.filterColumns.bind(host)
    host.selectView = this.selectView.bind(host)
    host.deleteSavedView = this.deleteSavedView.bind(host)
    host.onSaveNewViewButtonClick = this.onSaveNewViewButtonClick.bind(host)
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
    let sorters = []
    let filters = []
    let record = {
      name: this.savedViewName || this.selectedView.name,
      columns: this.selectedColumns.map(e => e.name),
      sorters,
      filters
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
      setTimeout(() => this.selectedView = this.savedViewCollection.find(e => e.id === this.selectedView.id), 100)
    }
  }

  onSaveNewViewButtonClick = function(): void {
    this.createSavedView()
    this.savedViewName = ''
    this.modalService.close('viewSaveModal')
  }

  selectColumn = function(column: Field): void {
    if (this.selectedColumns.includes(column)) {
      this.selectedColumns = this.selectedColumns.filter(e => e !== column)
    } else {
      this.selectedColumns.push(column)
    }
  }

  isColumnSelected = function(column: Field): boolean {
    return this.selectedColumns.indexOf(column) > -1
  }

  filterColumns = function(): void {
    if (!this.selectedColumns.length) {
      this.hiddenColumns = []
    } else {
      this.hiddenColumns = this.model.fields.filter(e => !this.selectedColumns.includes(e))
    }
  }

  selectView = function(view: GridView): void {
    this.selectedView = view
    this.selectedColumns = []
    view.columns.forEach(column => this.selectedColumns.push(this.model.fields.find(e => e.name === column)))
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
