import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

interface ModelProxy {
  type: string
  url: string
  reader: {
    root: string
    totalProperty: string
  }
}

interface Field {
  name: string
  displayName: string
  type: string
  useNull?: boolean
  dateFormat?: string
  submitFormat?: string
}

export default abstract class Model {
  abstract proxy: ModelProxy
  abstract fields: Field[]
  abstract pageSize: number
  private data$ = new BehaviorSubject<any[]>([])
  private page$ = new BehaviorSubject<number>(1)
  private totalCount$ = new BehaviorSubject<number>(0)

  constructor(private http: HttpClient) {}

  get data() { return this.data$.getValue() }
  get page() { return this.page$.getValue() }
  get totalCount() { return this.totalCount$.getValue() }
  get startIndex() { return (this.page - 1) * this.pageSize + 1 }
  get endIndex() { return this.page * this.pageSize > this.totalCount ? this.totalCount : this.page * this.pageSize }
  get lastPageIndex() { return Math.ceil(this.totalCount / this.pageSize) }

  load(page = 1): void {
    let params = {
      page: page.toString(),
      start: ((page - 1) * this.pageSize).toString(),
      limit: this.pageSize.toString()
    }
    this.http.get(environment.apiUrl + this.proxy.url, { params }).pipe(
      tap(response => {
        this.page$.next(Number(page))
        this.totalCount$.next(response[this.proxy.reader.totalProperty])
      }),
      map(response => response[this.proxy.reader.root])
    ).subscribe(
      root => this.data$.next(root)
    )
  }

  loadData(data: any): void {
    this.data$.next(data)
  }

  nextPage(): void {
    if (this.page < this.lastPageIndex) this.load(this.page + 1)
  }

  prevPage(): void {
    if (this.page > 1) this.load(this.page - 1)
  }

  firstPage(): void {
    this.load()
  }

  lastPage(): void {
    this.load(this.lastPageIndex)
  }
}
