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

  deleteFolder(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(environment.apiUrl + '/regulation/node/' + id.toString())
  }
}
