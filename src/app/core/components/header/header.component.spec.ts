import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HeaderComponent } from './header.component'
import { BrowserModule, By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { Component, DebugElement } from '@angular/core'
import { Router } from '@angular/router'

// menu component stub
@Component({
  selector: 'app-menu',
  template: '<div></div>'
})
class MenuStubComponent {
  toggle = jasmine.createSpy()
}

const routerStub = jasmine.createSpyObj('Router', ['navigateByUrl'])

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let compiled: DebugElement
  let router: jasmine.SpyObj<Router>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        FontAwesomeModule,
      ],
      declarations: [ HeaderComponent, MenuStubComponent ],
      providers: [ { provide: Router, useValue: routerStub } ]
    })

    router = TestBed.get(Router)
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

  it('should navigate to login page when logout is clicked', () => {
    expect(component.logout).toEqual(jasmine.any(Function))
    compiled.query(By.css('.logout')).nativeElement.click()
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login')
  })

  it('should show the menu on toggle click', () => {
    let menu = compiled.query(By.css('app-menu')).componentInstance
    compiled.query(By.css('.menu-trigger')).nativeElement.click()
    expect(menu.toggle).toHaveBeenCalledTimes(1)
  })
})
