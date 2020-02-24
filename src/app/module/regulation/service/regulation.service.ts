import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { RegulationNode } from '../regulation.component'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RegulationService {

  constructor(private http: HttpClient) { }

  getRegulations(): Observable<RegulationNode[]> {
    return this.http.get<RegulationNode[]>(environment.apiUrl + '/regulation')
  }
}
