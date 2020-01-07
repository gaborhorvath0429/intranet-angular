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
  displayName: string
  type: string
  dateFormat?: string
  width?: number
}

export default abstract class Model {
  abstract proxy: ModelProxy
  abstract fields: Field[]
  abstract pageSize: number
  private data$ = new BehaviorSubject<any[]>([])
  private page$ = new BehaviorSubject<number>(1)
  private totalCount$ = new BehaviorSubject<number>(0)
  public loading = false
  public sorters: { field: Field, type: 'ASC' | 'DESC' }[] = []
  public filters = []

  constructor(private http: HttpClient) {}

  get data() { return this.data$.getValue() }
  get page() { return this.page$.getValue() }
  get totalCount() { return this.totalCount$.getValue() }
  get startIndex() { return (this.page - 1) * this.pageSize + 1 }
  get endIndex() { return this.page * this.pageSize > this.totalCount ? this.totalCount : this.page * this.pageSize }
  get lastPageIndex() { return Math.ceil(this.totalCount / this.pageSize) }

  load(page: number = 1, extraParams: object = {}): void {
    this.loading = true
    let params = {
      page: page.toString(),
      start: ((page - 1) * this.pageSize).toString(),
      limit: this.pageSize.toString(),
      ...extraParams
    }
    this.http.get(environment.apiUrl + this.proxy.url, {params}).pipe(
      tap(response => {
        this.page$.next(Number(page))
        this.totalCount$.next(response[this.proxy.reader.totalProperty])
      }),
      map(response => response[this.proxy.reader.root])
    ).subscribe(root => {
      this.data$.next(root)
      this.loading = false
    })
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
}
