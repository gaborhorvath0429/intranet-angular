import { Directive, Input, ElementRef, HostBinding, HostListener, Host, Self, Optional } from '@angular/core'
import { FormGroup, AbstractControl } from '@angular/forms'
import { DatePickerComponent } from '../date-picker/date-picker.component'

@Directive({
  selector: '[formInput]'
})
export class FormInputDirective {

  @Input() form: FormGroup
  @Input() formControlName: string

  get input(): AbstractControl {
    return this.form.get(this.formControlName)
  }

  constructor(
    @Host() @Self() @Optional() private el: ElementRef<HTMLInputElement>,
    // we handle border coloring in datepicker component so we dont need this (yet)
    @Host() @Self() @Optional() private datePicker: DatePickerComponent
  ) { }

  @HostBinding('style.border-color') get borderColor() {
    return this.input.invalid && (this.input.touched || this.input.dirty) ? 'red' : ''
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.input.invalid) {
      Object.keys(this.input.errors).forEach(key => {
        switch (key) {
          case 'required':
            this.setTooltip('A mező kitöltése kötelező!')
            return
          case 'mustSelect':
            this.setTooltip('Kérem válasszon ki egy lehetőséget a listából!')
            return
          case 'minlength':
            this.setTooltip('A hosszának minimum ennyinek kell lennie: ' + this.input.errors[key].requiredLength)
            return
          case 'maxlength':
            this.setTooltip('A hossza maximum ennyi lehet: ' + this.input.errors[key].requiredLength)
            return
          case 'min':
            this.setTooltip('Az értékének minimum ennyinek kell lennie: ' + this.input.errors[key].min)
            return
          case 'max':
            this.setTooltip('A értéke maximum ennyi lehet: ' + this.input.errors[key].max)
            return
        }
      })
    } else {
      this.setTooltip('')
    }
  }

  setTooltip(text: string) {
    this.el.nativeElement.title = text
  }

}
