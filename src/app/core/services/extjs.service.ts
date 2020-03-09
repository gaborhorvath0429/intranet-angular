import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ExtjsService {

  show(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style.top = '55px'
    })
    document.getElementById('extjs').style.top = '55px'
  }

  hide(): void {
    Array.from(document.getElementsByClassName('x-window')).forEach((item: HTMLDivElement) => {
      item.style.top = '100vh'
    })
    document.getElementById('extjs').style.top = '100vh'
  }

}
