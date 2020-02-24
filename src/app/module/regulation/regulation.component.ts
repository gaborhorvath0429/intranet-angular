import { Component, OnInit } from '@angular/core'
import { faBars, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { of as observableOf } from 'rxjs'
import { NestedTreeControl } from '@angular/cdk/tree'
import { RegulationService } from './service/regulation.service'

export interface RegulationNode {
  children?: RegulationNode[]
  ID: number
  IS_PUBLIC: 0 | 1
  TITLE: string
  HASH: string
}

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.scss']
})
export class RegulationComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<RegulationNode>
  nestedDataSource: RegulationNode[] = []
  faBars = faBars
  faChevronRight = faChevronRight
  faChevronDown = faChevronDown

  constructor(private service: RegulationService) {
    this.nestedTreeControl = new NestedTreeControl<RegulationNode>(this.getChildren)
  }

  ngOnInit() {
    this.service.getRegulations().subscribe(regulations => {
      this.nestedDataSource = regulations
    })
  }

  hasNestedChild = (_: number, nodeData: RegulationNode) => nodeData.children

  private getChildren = (node: RegulationNode) => observableOf(node.children)
}
