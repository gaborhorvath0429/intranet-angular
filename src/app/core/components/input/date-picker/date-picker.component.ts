import { Component, Input, Output, EventEmitter, forwardRef,
  ViewEncapsulation, ElementRef, ViewChild, AfterViewInit } from '@angular/core'
import { IMyDateModel, IAngularMyDpOptions } from 'angular-mydatepicker'
import { NG_VALUE_ACCESSOR, FormControl, ControlValueAccessor } from '@angular/forms'
import * as moment from 'moment'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }]
})
export class DatePickerComponent implements AfterViewInit, ControlValueAccessor {

  @Input() model: IMyDateModel
  @Output() modelChange = new EventEmitter<IMyDateModel>()

  @Input() options: IAngularMyDpOptions
  @Input() placeholder = 'éééé.hh.nn'

  @Input() control: FormControl = new FormControl()
  @Input() formControlName?: string

  @Input() width?: number

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

  // propagate changes into the custom form control
  propagateChange = (_: any) => { }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value) {
      let date = moment(new Date(value))
      let dateObject = { year: date.year(), month: date.month() + 1, day: date.date() }
      let month = dateObject.month.toString()
      if (month.length === 1) month = '0' + month
      let day = dateObject.day.toString()
      if (day.length === 1) day = '0' + day
      let formatted = dateObject.year + '-' + month + '-' + day
      this.model = {
        isRange: false,
        singleDate: { date: dateObject, formatted }
      }
      this.onChange(this.model)
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) { }

}
