import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component'
import { fromEvent, animationFrameScheduler } from 'rxjs'
import { map, switchMap, takeUntil, tap, subscribeOn } from 'rxjs/operators'
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
    let headers = document.getElementsByClassName('table-header-' + this.module)
    let label = document.getElementById('drag-label-' + this.module)

    let mousedown$ = fromEvent<MouseEvent>(headers, 'mousedown')
    let mousemove$ = fromEvent<MouseEvent>(document, 'mousemove')
    let mouseup$ = fromEvent<MouseEvent>(document, 'mouseup')

    let drag$ = mousedown$.pipe(
      tap((e: any) => {
        label.style.display = 'block'
        label.innerHTML = e.target.textContent
        label.setAttribute('data-field', e.target.getAttribute('data-field'))
      }),
      switchMap(
        (start) => mousemove$.pipe(map(move => {
          move.preventDefault()
          return {
            left: move.clientX - start.offsetX,
            top: move.clientY - start.offsetY
          }
        }),
        takeUntil(mouseup$.pipe(
          tap((e: any) => {
            label.style.display = 'none'
            if (e.toElement.classList.contains('filters')) {
              this.filterFields.add(this.model.fields.find((field: Field) => field.name === label.getAttribute('data-field')))
            } else if (e.toElement.classList.contains('sorters')) {
              this.sorterFields.add(this.model.fields.find((field: Field) => field.name === label.getAttribute('data-field')))
            }
          })
        )))
      )
    )

    let position$ = drag$.pipe(subscribeOn(animationFrameScheduler))

    position$.subscribe(pos => {
      label.style.top = `${pos.top + 30}px`
      label.style.left = `${pos.left + 30}px`
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
    this.modalService.open('gridFilterModal-' + this.module)
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
