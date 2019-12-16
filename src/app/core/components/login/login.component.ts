import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

@Component({ templateUrl: 'login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {

    username = ''
    password = ''
    returnUrl: string
    error = ''

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit(): void {
        // reset login status
        this.authenticationService.logout()

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
    }

    signIn(): void {
        this.authenticationService.login(this.username, this.password)
          .subscribe(
            data => {
                this.router.navigate([this.returnUrl])
            },
            error => {
                this.error = 'Invalid credentials'
            })
    }
}
