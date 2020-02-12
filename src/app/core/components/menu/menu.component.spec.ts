import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MenuComponent } from './menu.component'
import { BrowserModule } from '@angular/platform-browser'
import { translateModuleLoader } from 'src/app/app.module'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MenuSearchPipe } from './pipe/search.pipe'
import { HttpClientModule } from '@angular/common/http'
import { MenuModel } from './model/menu'
import { MostVisitedMenusService } from '../../services/socket.service'
import { ElementRef } from '@angular/core'

let mostVisitedMenusServiceStub = jasmine.createSpy('mostVisitedMenusService')

let menuModelStub: Partial<MenuModel>
menuModelStub = {
  data: []
}

describe('MenuComponent', () => {
  let component: MenuComponent
  let fixture: ComponentFixture<MenuComponent>
  let compiled: any
  let menuModel: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        RouterTestingModule,
        translateModuleLoader,
        HttpClientModule,
        FontAwesomeModule
      ],
      declarations: [
        MenuComponent,
        MenuSearchPipe
      ],
      providers: [
        { provide: MenuModel, useValue: menuModelStub },
        { provide: MostVisitedMenusService, useValue: mostVisitedMenusServiceStub }
      ]
    })

    fixture = TestBed.createComponent(MenuComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
    component.initMostVisitedMenus = jasmine.createSpy('initMostVisitedMenus')
    menuModel = fixture.debugElement.injector.get(MenuModel)

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should be hidden first', () => {
    expect(component.hidden).toEqual(true)
    expect(compiled.querySelector('.menu').style.display).toEqual('none')
  })

  it('should ref the menu element', () => {
    expect(component.menu instanceof ElementRef).toBeTruthy()
  })

  it('should check for most visited menus', () => {
    expect(component.initMostVisitedMenus).toHaveBeenCalledTimes(1)
    expect(component.mostVisitedMenus.length).toBeDefined()
  })

  it('should have icons attribute', () => {
    expect(Object.keys(component.icons).length).not.toBe(0)
  })

  it('should show when toggled', () => {
    component.toggle()
    fixture.detectChanges()
    expect(compiled.querySelector('.menu').style.display).toEqual('block')
  })

  it('should show the menu items', () => {
    menuModel.data = [
      { id: 1, path: 'viekr', title: 'VIEKR', icon: 'faArchive' },
      { id: 1, path: 'overpayment-inclusion', title: 'Túlfizetés beszámítás', icon: 'faListAlt' }
    ]

    fixture.detectChanges()
    expect(compiled.querySelectorAll('.menu-item').length).toEqual(2)
  })
})
