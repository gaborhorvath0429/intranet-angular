import { Component } from '@angular/core'
import { faBars, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router'

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
    private router: Router
  ) { }

  logout(): void {
    this.router.navigateByUrl('/login') // login constructor logs us out so we dont have to
  }

}
