import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ModalService } from '../../services/modal-service.service'
import { FormSubmit } from '../../decorators/form-submit'
import { ModalComponent } from '../modal/modal.component'

@Component({ templateUrl: 'login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {
  returnUrl: string

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  @ViewChild('modal') modal: ModalComponent

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    let uriToken = window.localStorage.getItem('uriToken')

    if (uriToken && this.authenticationService.currentUser) {
      this.router.navigateByUrl(uriToken)
    } else {
      this.modal.open()
      this.authenticationService.logout()
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null
    }

  }

  @FormSubmit('loginForm')
  signIn(): void {
    this.authenticationService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .subscribe(
        data => {
          this.modalService.close('login')
          if (this.returnUrl) this.router.navigateByUrl(this.returnUrl)
        },
        error => {
          this.modalService.showError(null, 'Username or password invalid')
        })
  }
}
