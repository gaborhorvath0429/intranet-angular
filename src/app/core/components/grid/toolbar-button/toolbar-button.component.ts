import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-toolbar-button',
  templateUrl: './toolbar-button.component.html',
  styleUrls: ['./toolbar-button.component.scss']
})
export class ToolbarButtonComponent {

  @Input() disabled?: boolean
  @Input() float?: 'left' | 'right'
  @Input() type?: string

  constructor() {}

}
