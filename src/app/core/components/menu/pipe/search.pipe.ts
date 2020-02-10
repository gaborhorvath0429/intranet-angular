import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'menuSearch'
})
export class MenuSearchPipe implements PipeTransform {

  transform(items: any[], search: string): any[] {
    if (!items) return []
    if (!search) return items

    return items.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
  }

}
