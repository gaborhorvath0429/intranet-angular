import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { IncomingModel } from './model/incoming'
import { GridComponent } from 'src/app/core/components/grid/grid.component'

@Component({
  selector: 'app-viekr',
  templateUrl: './viekr.component.html',
  styleUrls: ['./viekr.component.scss']
})
export class ViekrComponent implements OnInit, AfterViewInit {

  constructor(public incomingModel: IncomingModel) { }

  @ViewChild(GridComponent) grid: GridComponent

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
