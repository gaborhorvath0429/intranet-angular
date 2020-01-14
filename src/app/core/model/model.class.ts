import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export interface ModelProxy {
  type: string
  url: string
  reader: {
    root: string
    totalProperty: string
  }
}

export interface Field {
  name: string
  displayName?: string
  type: string
  dateFormat?: string
  width?: number
  mapping?: string
  defaultValue?: any
  filterModel?: {
    model: Model,
    filterAttribute: string,
    labelAttribute: string
  }
  convert?: (record: any) => any
}

export interface Filter {
  field: string
  data: {
    type: string
    mode: string
    value: any
    comparison?: 'eq' | 'lt' | 'gt'
  }
}

export interface Sorter {
  field: Field
  type: 'ASC' | 'DESC'
}

export default abstract class Model {
  abstract proxy: ModelProxy
  abstract fields: Field[]
  public pageSize?: number
  private data$ = new BehaviorSubject<any[]>([])
  private page$ = new BehaviorSubject<number>(1)
  private totalCount$ = new BehaviorSubject<number>(0)
  public loading = false
  public sorters: Sorter[] = []
  public filters: Filter[] = []

  constructor(private http: HttpClient) { }

  get data() { return this.data$.getValue() }
  get page() { return this.page$.getValue() }
  get totalCount() { return this.totalCount$.getValue() }
  get startIndex() { return (this.page - 1) * this.pageSize + 1 }
  get endIndex() { return this.page * this.pageSize > this.totalCount ? this.totalCount : this.page * this.pageSize }
  get lastPageIndex() { return Math.ceil(this.totalCount / this.pageSize) }

  get displayFields(): Field[] {
    return this.fields.filter(e => Boolean(e.displayName))
  }

  load(page: number = 1, extraParams: object = {}): void {
    this.loading = true
    let params = {
      page: page.toString(),
      start: this.pageSize ? ((page - 1) * this.pageSize).toString() : '',
      limit: this.pageSize ? this.pageSize.toString() : '',
      sort: this.sorterString,
      filter: this.filterString,
      ...extraParams
    }
    this.http.get(environment.apiUrl + this.proxy.url, {params}).pipe(
      tap(response => {
        this.page$.next(Number(page))
        this.totalCount$.next(response[this.proxy.reader.totalProperty])
      }),
      map(response => {
        let data = response[this.proxy.reader.root]
        return data.map((item: any) => {
          for (let field of this.fields) {
            if (field.mapping) item[field.name] = item[field.mapping]
            if (field.defaultValue) item[field.name] = field.defaultValue
            if (field.convert) item[field.name] = field.convert(item)
          }
          return item
        })
      })
    ).subscribe(root => {
      this.data$.next(root)
      this.loading = false
    }, () => this.loading = false)
  }

  loadData(data: any): void {
    this.data$.next(data)
  }

  nextPage(extraParams: object = {}): void {
    if (this.page < this.lastPageIndex) this.load(this.page + 1, extraParams)
  }

  prevPage(extraParams: object = {}): void {
    if (this.page > 1) this.load(this.page - 1, extraParams)
  }

  firstPage(extraParams: object = {}): void {
    this.load(1, extraParams)
  }

  lastPage(extraParams: object = {}): void {
    this.load(this.lastPageIndex, extraParams)
  }

  hasSorter(field: Field): string {
    let sorter = this.sorters.find(e => e.field === field)
    if (sorter) return sorter.type
    return ''
  }

  deleteSort(field: Field): void {
    this.sorters = this.sorters.filter(e => e.field !== field)
  }

  deleteFilter(field: Field): void {
    this.filters = this.filters.filter(e => e.field !== field.name)
  }

  get sorterString(): string {
    let sorterArray = []
    for (let sorter of this.sorters) {
      sorterArray.push({
        direction: sorter.type,
        property: sorter.field.name
      })
    }
    return JSON.stringify(sorterArray)
  }

  get filterString(): string {
    return JSON.stringify(this.filters)
  }

  addFilters(filters: Filter[]): void {
    // first we remove existing filters for these fields
    for (let filter of filters) {
      this.filters = this.filters.filter(e => e.field !== filter.field)
    }
    // add filters
    this.filters = this.filters.concat(filters)
  }
}
