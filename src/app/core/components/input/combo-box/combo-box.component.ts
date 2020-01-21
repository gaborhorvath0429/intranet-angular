import { Component, Input, forwardRef, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, EventEmitter, Output } from '@angular/core'
import Model from 'src/app/core/model/model.class'
import { NG_VALUE_ACCESSOR, FormControl, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms'
import * as _ from 'lodash'

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ComboBoxComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: ComboBoxComponent,
    multi: true
  }]
})
export class ComboBoxComponent implements AfterViewInit, ControlValueAccessor {

  @Input() placeholder = 'Kérem válasszon...'
  @Input('model') set model(value: Model) {
    this.data = _.clone(value.data)
  }
  @Input() labelAttribute = 'name'
  @Input() idAttribute = 'id'
  @Input() submitAttribute = 'id'
  @Input() listPosition: 'top' | 'bottom' = 'bottom'
  @Input() width: number
  @Input() disabled = false

  @Input() control: FormControl = new FormControl()
  @Input() formControlName?: string

  @ViewChild('input') inputRef: ElementRef

  @Output() selectionChange = new EventEmitter()

  data: any[]
  inputText = ''
  listHidden = true
  selected: any

  onTouched: () => void

  constructor() { }

  setData(data: any[]) {
    this.data = data
  }

  ngAfterViewInit() {
    this.control.valueChanges.subscribe(
      () => { // reset the input when the form is reset.
        if (this.control.value === '' || this.control.value == null || this.control.value === undefined) {
          this.inputText = ''
          this.inputRef.nativeElement.value = ''
        }
      }
    )
  }

  selectItem(item: any): void {
    if (!this.data.includes(item)) {
      console.error('Combobox model does not contain the item you want to select')
      this.inputText = ''
      this.listHidden = true
      return
    }
    this.selected = item
    this.inputText = item[this.labelAttribute]
    this.listHidden = true
    // propagate value into form control using control value accessor interface
    this.propagateChange(this.submitValue)
    this.selectionChange.emit(item)
  }

  toggleListDisplay(show: boolean): void {
    if (show) {
      this.listHidden = false
    } else {
      // we need setTimeout here because otherwise the "blur" event closes the window earlier than the "click" event occurs
      setTimeout(() => this.listHidden = true, 100)
    }
  }

  // event fired when input value is changed . later propagated up to the form control using the custom value accessor interface
  onChange() {
    let match = this.data.find(e => e[this.labelAttribute] === this.inputText)
    if (match) {
      this.selectItem(match)
    } else {
      this.selected = null
      this.propagateChange(this.inputText)
    }
    if (this.onTouched) this.onTouched()
  }

  // get accessor
  get submitValue(): any {
    return this.selected ? this.selected[this.submitAttribute] : null
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.inputText) {
      this.inputText = v
    }
  }

  // propagate changes into the custom form control
  propagateChange = (_: any) => { }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    this.inputText = value
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) { this.onTouched = fn }

  validate({ value }: FormControl) {
    if (!this.selected) {
      return {
        mustSelect: true
      }
    }
  }

  getBorderColor() {
    if (!this.control) return ''
    return this.control.invalid && (this.control.touched || this.control.dirty) ? 'red' : ''
  }
}
