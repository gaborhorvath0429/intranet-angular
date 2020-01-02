import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component'

@Directive({
  selector: '[showPaginator]'
})
export class ShowPaginatorDirective {

  constructor(host: GridComponent) {
    host.paginator = true
  }

}
