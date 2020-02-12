import { Component } from '@angular/core'
import { faBars, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  // Icons
  faBars = faBars
  faBell = faBell
  faSignOutAlt = faSignOutAlt

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }


  logout(): void {
    this.authenticationService.logout()
    this.router.navigateByUrl('/login')
  }

}
