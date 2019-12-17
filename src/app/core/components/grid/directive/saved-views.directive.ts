import { Directive } from '@angular/core'
import { GridComponent } from '../grid.component';

@Directive({
  selector: '[appSavedViews]',
  exportAs: 'savedViews'
})
export class SavedViewsDirective {

  constructor(private host: GridComponent) {
    host.ngOnInit = () => host.initSavedViews()
  }

}
