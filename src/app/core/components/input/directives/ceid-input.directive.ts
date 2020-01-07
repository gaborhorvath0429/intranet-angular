import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[ceidInput]'
})
export class CeidInputDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // limit it to 8 characters.
  @HostListener('keydown', ['$event']) checkLength(e: any) {
    if (e.which >= 48 && e.which <= 57) { // number
      e.preventDefault()
      if (this.el.nativeElement.value.length < 8) {
        this.el.nativeElement.value += e.key
        this.el.nativeElement.dispatchEvent(new Event('input')) // needed for ngModel to update
      }
    } else if (e.which >= 65 && e.which <= 90 && e.ctrlKey === false) e.preventDefault() // "e"
  }

}
