import { Component, OnInit, Input } from '@angular/core'
import Model from 'src/app/core/model/model.class'

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss']
})
export class ComboBoxComponent implements OnInit {

  @Input() placeholder = 'Kérem válasszon...'
  @Input() model: Model
  @Input() labelAttribute = 'name'
  @Input() idAttribute = 'id'
  @Input() listPosition: 'top' | 'bottom' = 'bottom'

  inputText = ''
  listHidden = true
  selected: any

  constructor() { }

  ngOnInit() { }

  get list(): string[] {
    return this.model.data
  }

  selectItem(item: any): void {
    this.selected = item
    this.inputText = item[this.labelAttribute]
    this.listHidden = true
  }

  toggleListDisplay(show: boolean): void {
    if (show) {
      this.listHidden = false
    } else {
      // we need setTimeout here because otherwise the "blur" event closes the window earlier than the "click" event occurs
      setTimeout(() => this.listHidden = true, 100)
    }
  }

  inputChange(): void {
    let match = this.list.find(e => e[this.labelAttribute] === this.inputText)
    if (match) this.selectItem(match)
  }
}
