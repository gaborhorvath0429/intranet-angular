import { Injectable } from '@angular/core'
import { HttpClient, HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { Router } from '@angular/router'
import { ModalService } from './modal-service.service'
import { ExtjsService } from './extjs.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<string>

  constructor(
    private http: HttpClient,
    private extjsService: ExtjsService
  ) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('user'))
  }

  public get currentUser(): string {
    return this.currentUserSubject.value
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, { username, password })
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('user', user.user.userId)
          this.currentUserSubject.next(user)
        }

        return user
      }))
  }

  public logout() {
    this.extjsService.hide()
    localStorage.removeItem('user')
    this.currentUserSubject.next(null)
  }
}

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private modalService: ModalService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true
    })

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout()
      }

      if (err.status === 401 && this.router.url.indexOf('/login') !== 0) {
        location.reload(true)
        return
      }

      if (err.status === 401 && this.router.url.indexOf('/login') === 0) {
        this.modalService.open('login')
        return
      }

      if (err.error.error !== 'login_required') this.modalService.showError(err)

      return throwError(err)
    }))
  }
}
