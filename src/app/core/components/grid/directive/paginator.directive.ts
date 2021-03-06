import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component'

@Directive({
  selector: '[showPaginator]'
})
export class PaginatorDirective {

  constructor(host: GridComponent) {
    host.paginator = true
  }

}
