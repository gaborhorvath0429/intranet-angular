import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ExtjsService {

  constructor() { }

  show(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style.display = 'block'
    })
  }

  hide(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style.display = 'none'
    })
  }
}
