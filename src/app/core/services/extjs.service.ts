import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ExtjsService {

  show(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style['margin-top'] = 0
    })
  }

  hide(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style['margin-top'] = '100vh'
    })
  }

}
