import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { ApiResponse } from 'src/app/app.module'
import { IncomingModel } from '../model/incoming'
import { OutgoingModel } from '../model/outgoing'
import { SentModel } from '../model/sent'

export interface SubscriberDetails {
  ceid: number
  clientName: string
  closingCode: string
  mainDebtor: number
  subscriberId: number
  subscriberIsDead: number
  subscriberName: string
  subscriberType: string
  unifiedCases: number
  zone: string
}

export interface Subscriber {
  ceid: number
  doctypeId?: number
  subscriber?: string
  subscriberId: number
}

export interface AttachmentData {
  attachmentId?: number
  assignee: string
  due_date: Date
  file_name: string
  locked: boolean
  lock_userId?: string
  lock_user?: string
  status: number
  tartalom: string
  vh_level_type: number
  ceidData?: { ceid: number, subscriberId: number }[]
  rows: Subscriber[]
}

export interface ReplyDetails {
  CEID: number
  CSATOLMANY_ID: number
  ELOZMENYAZONOSITO: string
  SUBSCRIBER_ID: number
  SZERVEZET_ID: number
  UZENET_ID: number
  VEGREHAJTO_ID: number
  VEGREHAJTO_UGYSZAM: string
}

export interface Message {
  elozmenyAzonosito: string
  organizationId: string
  subscriberId: string
  actionType: string
  vhNumber: string
  subject: string
  message: string
  ceids: string
  files: File[]
}

@Injectable({
  providedIn: 'root'
})
export class ViekrService {

  constructor(
    private http: HttpClient,
    private incomingModel: IncomingModel,
    private outgoingModel: OutgoingModel,
    private sentModel: SentModel
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

  exportOutgoing(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/export', {
      columns: this.outgoingModel.displayFields.map(e => e.name),
      filter: JSON.parse(this.outgoingModel.filterString),
      sort: JSON.parse(this.outgoingModel.sorterString),
      tab: 'KIMENO'
    })
  }

  exportSent(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/export', {
      columns: this.sentModel.displayFields.map(e => e.name),
      filter: JSON.parse(this.sentModel.filterString),
      sort: JSON.parse(this.sentModel.sorterString),
      tab: 'ELKULDOTT'
    })
  }

  blockOutgoing(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/blockOutgoing', { attachmentId: id })
  }

  getAttachmentData(row: any): Observable<AttachmentData> {
    let params = { attachment_id: row.id }
    return this.http.get<AttachmentData>(environment.apiUrl + '/viekr/getDetails', { params })
  }

  saveAttachment(data: AttachmentData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/setStatus', data)
  }

  getVhNumber(ceid: number, subscriberId: number): Observable<{executorCaseId: string}> {
    return this.http.post<{executorCaseId: string}>(environment.apiUrl + '/viekr/getVHNumber', { ceid, subscriberId })
  }

  fetchMessage(id: string): Observable<ReplyDetails> {
    let params = { attachmentId: id }
    return this.http.get<ReplyDetails>(environment.apiUrl + '/viekr/getReplyDetails', { params })
  }

  sendMessage(message: Message): Observable<ApiResponse> {
    let formData: FormData = new FormData()
    formData.append('elozmenyAzonosito', message.elozmenyAzonosito)
    formData.append('organizationId', message.organizationId)
    formData.append('subscriberId', message.subscriberId)
    formData.append('vhNumber', message.vhNumber)
    formData.append('subject', message.subject)
    formData.append('message', message.message)
    formData.append('actionType', message.actionType)
    message.ceids.split(',').map((val: string) => val.trim()).forEach(ceid => formData.append('ceids', ceid))
    message.files.forEach(file => file ? formData.append('files', file, file.name) : null)

    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/sendMessage', formData)
  }

  unlockAttachment(attachmentId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiUrl + '/viekr/unlock', { attachment_id: attachmentId })
  }
}
