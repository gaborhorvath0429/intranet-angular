import Model from 'src/app/core/model/model.class'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PreviewModel extends Model {
  constructor(http: HttpClient) {
    super(http)
    super.init()
  }

  pageSize = 10

  autoLoad = false

  proxy = {
    type: 'memory'
  }

  fields = [] // dynamic
}
