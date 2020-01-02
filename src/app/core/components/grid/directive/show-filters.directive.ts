import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component'

@Directive({
  selector: '[showFilters]'
})
export class ShowFiltersDirective {

  constructor(host: GridComponent) {
    host.showFilters = true
  }
}
