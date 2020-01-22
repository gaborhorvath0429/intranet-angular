import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component'
import { fromEvent } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Field } from 'src/app/core/model/model.class'
import * as moment from 'moment'

@Directive({
  selector: '[showFilters]'
})
export class FiltersDirective {

  constructor(host: GridComponent) {
    Object.assign(host, {
      showFilters: true,
      initDragAndDrop: this.initDragAndDrop.bind(host),
      sortBy: this.sortBy.bind(host),
      showFilterWindow: this.showFilterWindow.bind(host),
      deleteSort: this.deleteSort.bind(host),
      deleteFilter: this.deleteFilter.bind(host),
      onFilterButtonClick: this.onFilterButtonClick.bind(host),
      onRemoveFilterButtonClick: this.onRemoveFilterButtonClick.bind(host),
      toggleListFilterItem: this.toggleListFilterItem.bind(host),
      isFilterListItemChecked: this.isFilterListItemChecked.bind(host)
    })
  }

  initDragAndDrop = function(): void {
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

  sortBy = function(field: Field): void {
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

  showFilterWindow = function(field: Field): void {
    if (field.filterModel) {
      this.listFilterItems = []
      for (let item of field.filterModel.model.data) {
        this.listFilterItems[item[field.filterModel.filterAttribute]] = false
      }
    }
    let existingFilters = this.model.filters.filter(e => e.field === field.name)
    this.selectedFilterType = 'value'
    if (existingFilters.length) {
      for (let filter of existingFilters) {
        if (filter.data.type === 'empty' && filter.data.value === true) this.selectedFilterType = 'empty'
        if (filter.data.type === 'empty' && filter.data.value === false) this.selectedFilterType = 'not-empty'
        if (filter.data.comparison === 'eq') this.filterNumberValue = filter.data.value
        if (filter.data.comparison === 'lt') this.filterLtValue = filter.data.value
        if (filter.data.comparison === 'gt') this.filterGtValue = filter.data.value
        if (filter.data.type === 'string') this.filterTextValue = filter.data.value
        if (filter.data.type === 'date') {
          let date = moment(new Date(filter.data.value))
          let dateObject = { year: date.year(), month: date.month() + 1, day: date.date() }
          let month = dateObject.month.toString()
          if (month.length === 1) month = '0' + month
          let day = dateObject.day.toString()
          if (day.length === 1) day = '0' + day
          let dateValue = {
            isRange: false,
            singleDate: { date: dateObject, formatted: dateObject.year + '-' + month + '-' + day }
          }
          if (filter.data.comparison === 'eq') this.filterDateValue = dateValue
          if (filter.data.comparison === 'lt') this.filterDateLtValue = dateValue
          if (filter.data.comparison === 'gt') this.filterDateGtValue = dateValue
        }
        if (filter.data.type === 'list') {
          let checked = filter.data.value.split(',')
          for (let id in this.listFilterItems) {
            if (checked.includes(id.toString())) this.listFilterItems[id] = true
          }
        }
      }
    } else {
      this.filterGtValue = ''
      this.filterLtValue = ''
      this.filterDateGtValue = null
      this.filterDateLtValue = null
      this.filterDateValue = null
      this.filterTextValue = ''
      this.filterNumberValue = ''
    }
    this.selectedFilterField = field
    this.modalService.open('gridFilterModal')
  }

  deleteSort = function(field: Field): void {
    this.sorterFields.delete(field)
    this.model.deleteSort(field)
    this.model.load(1, this.searchParams)
  }

  deleteFilter = function(field: Field): void {
    this.filterFields.delete(field)
    this.model.deleteFilter(field)
    this.model.load(1, this.searchParams)
  }

  onFilterButtonClick = function(): void {
    let filters = []
    let field = this.selectedFilterField
    if (field.filterModel) {
      switch (this.selectedFilterType) {
        case 'value':
          let values = []
          for (let id in this.listFilterItems) {
            if (this.listFilterItems[id]) values.push(id)
          }
          filters.push({field: field.name, data: {type: 'list', mode: 'value', value: values.join(',')}})
          break
        case 'empty':
          filters.push({field: field.name, data: {type: 'empty', value: true}})
          break
        case 'not-empty':
          filters.push({field: field.name, data: {type: 'empty', value: false}})
          break
      }
    } else {
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
          break
        case 'date':
          switch (this.selectedFilterType) {
            case 'value':
              if (this.filterDateValue)
                filters.push({
                  field: field.name,
                  data: {type: 'date', mode: 'value', value: this.filterDateValue.singleDate.formatted, comparison: 'eq'
                }})
              if (this.filterDateLtValue)
                filters.push({
                  field: field.name,
                  data: {type: 'date', mode: 'value', value: this.filterDateLtValue.singleDate.formatted, comparison: 'lt'
                }})
              if (this.filterDateGtValue)
                filters.push({
                  field: field.name,
                  data: {type: 'date', mode: 'value', value: this.filterDateGtValue.singleDate.formatted, comparison: 'gt'
                }})
              break
            case 'empty':
              filters.push({field: field.name, data: {type: 'empty', value: true}})
              break
            case 'not-empty':
              filters.push({field: field.name, data: {type: 'empty', value: false}})
              break
          }
          break
      }
    }

    this.model.addFilters(filters)
    this.model.load(1, this.searchParams)
  }

  onRemoveFilterButtonClick = function(): void {
    this.model.filters = this.model.filters.filter(e => e.field !== this.selectedFilterField.name)
    this.filterFields.delete(this.selectedFilterField)
    this.model.load(1, this.searchParams)
  }

  toggleListFilterItem = function(item: any): void {
    let id = item[this.selectedFilterField.filterModel.filterAttribute]
    this.listFilterItems[id] = !this.listFilterItems[id]
  }

  isFilterListItemChecked = function(item: any): boolean {
    return this.listFilterItems[item[this.selectedFilterField.filterModel.filterAttribute]]
  }
}
