import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'comboSearch'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], search: string, labelAttribute: string): any[] {
    if (!items) return []
    if (!search) return items

    return items.filter(e => e[labelAttribute].toLowerCase().includes(search.toLowerCase()))
  }

}
