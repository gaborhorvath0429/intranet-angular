import { Component, Input } from '@angular/core'
import Model from 'src/app/core/model/model.class'

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() model: Model
  @Input() searchParams?: any

  constructor() { }

}
