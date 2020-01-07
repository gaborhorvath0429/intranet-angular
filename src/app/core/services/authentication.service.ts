import { Injectable } from '@angular/core'
import { HttpClient, HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../../environments/environment'
import { Router } from '@angular/router'
import { ModalService } from './modal-service.service'

interface User {
  displayName: string,
  email: string,
  faktorId: number,
  faktorOpid: string,
  ksiId: number,
  ksiOpid: string,
  login: string,
  perbitId: number,
  userId: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')))
  }

  public get currentUser(): User {
    return this.currentUserSubject.value
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, { username, password })
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user.user))
          this.currentUserSubject.next(user)
        }

        return user
      }))
  }

  public logout() {
    localStorage.removeItem('currentUser')
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
      if (err.status === 401 && this.router.url.indexOf('/login') !== 0) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout()
        location.reload(true)
      }
      this.modalService.showError(err)

      return throwError(err)
    }))
  }
}
