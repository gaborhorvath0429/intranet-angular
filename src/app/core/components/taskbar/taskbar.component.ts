import { Component } from '@angular/core'
import { TaskbarService } from '../../services/taskbar.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent {

  constructor(
    public service: TaskbarService,
    public router: Router
  ) { }

}
