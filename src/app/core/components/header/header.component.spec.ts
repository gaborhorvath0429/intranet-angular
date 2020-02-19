import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HeaderComponent } from './header.component'
import { BrowserModule, By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { Component, DebugElement } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../services/authentication.service'

// menu component stub
@Component({
  selector: 'app-menu',
  template: '<div></div>'
})
class MenuStubComponent {
  toggle = jasmine.createSpy()
}

// notifications component stub
@Component({
  selector: 'app-notifications',
  template: '<div></div>'
})
class NotificationsStubComponent {
  toggle = jasmine.createSpy()
}

const routerStub = jasmine.createSpyObj('Router', ['navigateByUrl'])
const authenticationServiceStub = jasmine.createSpyObj('AuthenticationService', ['logout'])

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let compiled: DebugElement
  let router: jasmine.SpyObj<Router>
  let authenticationService: jasmine.SpyObj<AuthenticationService>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        FontAwesomeModule,
      ],
      declarations: [ HeaderComponent, MenuStubComponent, NotificationsStubComponent ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authenticationServiceStub }
      ]
    })

    router = TestBed.get(Router)
    authenticationService = TestBed.get(AuthenticationService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should logout and navigate to login page when logout is clicked', () => {
    expect(component.logout).toEqual(jasmine.any(Function))
    compiled.query(By.css('.logout')).nativeElement.click()
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login')
    expect(authenticationService.logout).toHaveBeenCalledTimes(1)
  })

  it('should show the menu on toggle click', () => {
    let menu = compiled.query(By.css('app-menu')).componentInstance
    compiled.query(By.css('.menu-trigger')).nativeElement.click()
    expect(menu.toggle).toHaveBeenCalledTimes(1)
  })

  it('should show the notifications on toggle click', () => {
    let notifications = compiled.query(By.css('app-notifications')).componentInstance
    compiled.query(By.css('.notifications-trigger')).nativeElement.click()
    expect(notifications.toggle).toHaveBeenCalledTimes(1)
  })
})
