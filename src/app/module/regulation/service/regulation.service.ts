import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ApiResponse } from 'src/app/app.module'

export interface RegulationNode {
  children?: RegulationNode[]
  ID: number
  IS_PUBLIC: 0 | 1
  TITLE: string
  DESCRIPTION: string
  HASH: string
  PARENT_ID?: number
  TYPE: 'NODE' | 'ENTRY'
}

export interface RegulationAttachment {
  CREATE_DATE: string
  LAST_UPDATE_DATE: string
  description: string
  hash: string
  id: number
  name: string
  parent: number
}

@Injectable({
  providedIn: 'root'
})
export class RegulationService {

  constructor(private http: HttpClient) { }

  getRegulations(): Observable<RegulationNode[]> {
    return this.http.get<RegulationNode[]>(environment.apiUrl + '/regulation')
  }

  getAttachments(regulation: RegulationNode): Observable<ApiResponse<RegulationAttachment>> {
    return this.http.get<ApiResponse<RegulationAttachment>>(
      environment.apiUrl + '/regulation/attachment/' + regulation.ID.toString().replace('-', '')
    )
  }

  createFolder(parentId: number | null, title: string, description: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrl + '/regulation/node', {
      title,
      description,
      node: parentId
    })
  }

  editFolder(id: number, title: string, description: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(environment.apiUrl + '/regulation/node/' + id.toString(), {
      title,
      description
    })
  }

  deleteFolder(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(environment.apiUrl + '/regulation/node/' + id.toString())
  }

  createRegulation(values: any, node: number, document: File, attachment: File, groups: string[]): Observable<ApiResponse<any>> {
    let formData: FormData = new FormData()
    formData.append('node', node.toString())
    formData.append('title', values.name)
    formData.append('description', values.description)
    formData.append('public', values.public ? '1' : '0')
    formData.append('document', document, document.name)
    if (attachment) formData.append('attachment', attachment, attachment.name)
    groups.map(groupId => formData.append('group', groupId))

    return this.http.post<ApiResponse<any>>(environment.apiUrl + '/regulation/entry', formData)
  }

  updateRegulation(values: any, node: number, document: File, attachment: File, groups: string[]): Observable<ApiResponse<any>> {
    let formData: FormData = new FormData()
    formData.append('node', node.toString())
    formData.append('title', values.name)
    formData.append('description', values.description)
    formData.append('public', values.public ? '1' : '0')
    if (document) formData.append('document', document, document.name)
    if (attachment) formData.append('attachment', attachment, attachment.name)
    groups.map(groupId => formData.append('group', groupId))

    return this.http.put<ApiResponse<any>>(environment.apiUrl + '/regulation/entry/' + values.id, formData)
  }

  deleteRegulation(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(environment.apiUrl + '/regulation/entry/' + id)
  }

  deleteAttachment(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(environment.apiUrl + '/regulation/attachment/' + id)
  }
}
