import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserModule, By } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoginComponent } from './login.component'
import { AuthenticationService } from '../../services/authentication.service'
import { ModalComponent } from '../modal/modal.component'
import { FormInputDirective } from '../input/directives/form-input.directive'
import { ButtonComponent } from '../button/button.component'
import { translateModuleLoader } from 'src/app/app.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
import { DebugElement } from '@angular/core'
import * as _ from 'lodash'
import { of, throwError } from 'rxjs'
import { ModalService } from '../../services/modal-service.service'
import { MenuModel } from '../menu/model/menu'

let authenticationServiceStub = jasmine.createSpyObj('authenticationService', ['login', 'logout'])
let menuModelStub = jasmine.createSpyObj('menuModel', ['load'])

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let compiled: DebugElement
  let authenticationService: jasmine.SpyObj<AuthenticationService>
  let inputs: { [key: string]: DebugElement }
  let modalService: ModalService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        translateModuleLoader,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        LoginComponent,
        ModalComponent,
        FormInputDirective,
        ButtonComponent,
      ],
      providers: [
        { provide: MenuModel, useValue: menuModelStub },
        { provide: AuthenticationService, useValue: authenticationServiceStub }
      ]
    })

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement
    authenticationService = TestBed.get(AuthenticationService) as jasmine.SpyObj<AuthenticationService>
    modalService = TestBed.get(ModalService) // no need to stub this
    component.modal.open = jasmine.createSpy('open')

    fixture.detectChanges()

    inputs = {}
    let inputElements = compiled.queryAll(By.directive(FormInputDirective))
    for (let input of inputElements) {
      _.merge(inputs, {
        [input.attributes.formControlName]: input
      })
    }
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have username and password input', () => {
    expect(Object.keys(inputs).length).toBe(2)
    expect(inputs.username).toBeTruthy()
    expect(inputs.password).toBeTruthy()
  })

  it('should have a login button and that\'s the only button', () => {
    let buttons = compiled.queryAll(By.directive(ButtonComponent))
    expect(buttons.length).toBe(1)
    expect(buttons[0].nativeElement.textContent).toBe('Login')
  })

  it('should open its modal and log out when created', () => {
    let open = component.modal.open as jasmine.Spy
    expect(open.calls.any()).toBe(true)
    expect(authenticationService.logout.calls.any()).toBe(true)
    expect(component.modal instanceof ModalComponent).toBe(true)
  })

  it('should handle form inputs properly', () => {
    let usernameInput = inputs.username.nativeElement
    let passwordInput = inputs.password.nativeElement

    let usernameControl = component.loginForm.controls.username
    let passwordControl = component.loginForm.controls.password

    expect(usernameControl.valid).toBe(false)
    expect(passwordControl.valid).toBe(false)
    expect(component.loginForm.valid).toBe(false)

    usernameInput.value = 'testUser'
    passwordInput.value = 'testPassword'

    usernameInput.dispatchEvent(new Event('input'))
    passwordInput.dispatchEvent(new Event('input'))

    fixture.detectChanges()

    expect(usernameControl.valid).toBe(true)
    expect(passwordControl.valid).toBe(true)
    expect(component.loginForm.valid).toBe(true)
  })

  it('should handle valid login properly', () => {
    component.loginForm.controls.username.setValue('testUser')
    component.loginForm.controls.password.setValue('testPassword')

    let login = authenticationService.login.and.returnValue(of(''))
    modalService.close = jasmine.createSpy('close')

    component.signIn()

    expect(login.calls.any()).toBe(true)
    expect(login.calls.first().args).toEqual(['testUser', 'testPassword'])
    expect(modalService.close).toHaveBeenCalledTimes(1)
  })

  it('should handle invalid login properly', () => {
    component.loginForm.controls.username.setValue('testUser')
    component.loginForm.controls.password.setValue('testPassword')

    authenticationService.login.and.returnValue(throwError('invalid credentials'))
    modalService.showError = jasmine.createSpy('showError')
    modalService.close = jasmine.createSpy('close')

    component.signIn()

    expect(modalService.showError).toHaveBeenCalledTimes(1)
    expect(modalService.close).toHaveBeenCalledTimes(0)
  })
})
