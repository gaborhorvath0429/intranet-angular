import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[ceidInput]'
})
export class CeidInputDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // limit it to 8 characters.
  @HostListener('keydown', ['$event']) checkLength(e: any) {
    if (this.el.nativeElement.value.length > 7 && e.which !== 8 && e.ctrlKey === false) {
      e.preventDefault()
    }
  }

}
