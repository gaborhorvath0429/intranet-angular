import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterItemsSearch'
})
export class FilterItemsSearchPipe implements PipeTransform {

  transform(items: { id: string, name: string }[], search: string): any[] {
    if (!items) return []
    if (!search) return items

    return items.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
  }

}
