import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { TaskbarService } from '../../services/taskbar.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {

  @Input() title: string

  @ViewChild('page') page: ElementRef<HTMLDivElement>

  constructor(
    private taskbarService: TaskbarService,
    private router: Router
  ) { }

  close(): void {
    this.taskbarService.remove(this.router.url)
    this.page.nativeElement.style.display = 'none'
  }

}
