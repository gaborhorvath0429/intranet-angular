import { Component, Input, Output, EventEmitter, forwardRef,
  ViewEncapsulation, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core'
import { IMyDateModel, IAngularMyDpOptions } from 'angular-mydatepicker'
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms'

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DatePickerComponent implements AfterViewInit {

  @Input() model: IMyDateModel
  @Output() modelChange = new EventEmitter<IMyDateModel>()

  @Input() options: IAngularMyDpOptions
  @Input() placeholder: string

  @Input() control: FormControl = new FormControl()
  @Input() formControlName?: string

  @ViewChild('input') inputRef: ElementRef

  private innerValue = ''

  constructor() { }

  ngAfterViewInit() {
    this.control.valueChanges.subscribe(
      () => { // reset the input when the form is reset.
        if (this.control.value === '' || this.control.value == null || this.control.value === undefined) {
          this.innerValue = ''
          this.inputRef.nativeElement.value = ''
        }
      }
    )
  }

  getBorderColor() {
    if (!this.control) return ''
    return this.control.invalid && (this.control.touched || this.control.dirty) ? 'red' : ''
  }

  // event fired when input value is changed . later propagated up to the form control using the custom value accessor interface
  onChange(e: IMyDateModel) {
    // set changed value
    this.innerValue = e ? e.singleDate.formatted : ''

    // propagate value into form control using control value accessor interface
    this.propagateChange(this.innerValue)
  }

  // get accessor
  get value(): any {
    return this.innerValue
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v
    }
  }

  // propagate changes into the custom form control
  propagateChange = (_: any) => { }

  // From ControlValueAccessor interface
  writeValue(value: any) {
      this.innerValue = value
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) { }

}
