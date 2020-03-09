import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core'
import { NotificationService } from '../../services/socket.service'

export interface Notification {
  title: string
  message: string
  arrivedAt: string
  unread: 0 | 1
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [NotificationService]
})
export class NotificationsComponent implements OnInit {

  public hidden = true
  public notifications: Notification[] = []

  @ViewChild('notificationsWindow') notificationsWindow: ElementRef<HTMLDivElement>

  constructor(
    public notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notificationService.fromEvent('getAll').subscribe((notifications: string) => {
      this.notifications = []
      JSON.parse(notifications).forEach((item: string) => {
        this.notifications.push(JSON.parse(item))
      })
      this.notifications = this.notifications.sort(
        (a, b) => (a.arrivedAt > b.arrivedAt) ? 1 : ((b.arrivedAt > a.arrivedAt) ? -1 : 0)
      ).reverse()
    })

    this.notificationService.emit('getAll')
  }

  get numberOfUnread(): number {
    return this.notifications.filter(e => e.unread).length
  }

  toggle(): void {
    this.hidden = !this.hidden
  }

  markAsRead(notification: Notification): void {
    this.notificationService.emit('read', JSON.stringify(notification))
    notification.unread = 0
  }

  delete(notification: Notification): void {
    this.notificationService.emit('delete', JSON.stringify(notification))
    this.notifications = this.notifications.filter(e => e !== notification)
  }

  deleteAll(): void {
    this.notificationService.emit('deleteAll')
    this.notifications = []
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    let target = event.target as HTMLElement
    if (!target.closest('.notifications-trigger') && !this.notificationsWindow.nativeElement.contains(target)) {
      this.hidden = true
    }
  }

}
