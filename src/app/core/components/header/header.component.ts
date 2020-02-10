import { Component, OnInit } from '@angular/core'
import { faBars, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // Icons
  faBars = faBars
  faBell = faBell
  faSignOutAlt = faSignOutAlt

  constructor() { }

  ngOnInit() {
  }

}
