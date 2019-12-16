import { Component, OnInit, Input } from '@angular/core'
import Model from '../../model/model.class'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() model: Model

  constructor() { }

  ngOnInit() {
  }

}
