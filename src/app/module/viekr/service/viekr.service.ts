import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { ApiResponse } from 'src/app/app.module'
import { IncomingModel } from '../model/incoming'

export interface AttachmentData {
  assignee: string
  due_date: Date
  file_name: string
  locked: boolean
  rows: {
    ceid: number
    doctypeId: number
    subscriber: string
    subscriberId: number
  }[]
  status: number
  tartalom: string
  vh_level_type: number
}

@Injectable({
  providedIn: 'root'
})
export class ViekrService {

  constructor(
    private http: HttpClient,
    private incomingModel: IncomingModel
  ) { }

  assignToUser(user: any, selected: any, count: number = 0): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/assignToUser', {
      attachmentId: JSON.stringify(selected.map(e => e.csatolmany_id)),
      messagesNum: count ? count : null,
      assignTo: user
    })
  }

  exportIncoming(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/export', {
      columns: this.incomingModel.displayFields.map(e => e.name),
      filter: JSON.parse(this.incomingModel.filterString),
      sort: JSON.parse(this.incomingModel.sorterString),
      tab: 'BEJOVO'
    })
  }

  getAttachmentData(row: any): Observable<AttachmentData> {
    let params = { attachment_id: row.id }
    return this.http.get<AttachmentData>(environment.apiUrl + '/viekr/getDetails', { params })
  }

}
