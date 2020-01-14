import { Component, Input, forwardRef, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core'
import Model from 'src/app/core/model/model.class'
import { NG_VALUE_ACCESSOR, FormControl, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms'

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
  @Input() model: Model
  @Input() labelAttribute = 'name'
  @Input() idAttribute = 'id'
  @Input() submitAttribute = 'id'
  @Input() listPosition: 'top' | 'bottom' = 'bottom'

  @Input() control: FormControl = new FormControl()
  @Input() formControlName?: string

  @ViewChild('input') inputRef: ElementRef

  inputText = ''
  listHidden = true
  selected: any

  onTouched: Function

  constructor() { }

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

  get list(): string[] {
    return this.model.data
  }

  selectItem(item: any): void {
    this.selected = item
    this.inputText = item[this.labelAttribute]
    this.listHidden = true
    // propagate value into form control using control value accessor interface
    this.propagateChange(this.submitValue)
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
    let match = this.list.find(e => e[this.labelAttribute] === this.inputText)
    if (match) {
      this.selectItem(match)
    } else {
      this.selected = null
      this.propagateChange(this.inputText)
    }
    this.onTouched()
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
