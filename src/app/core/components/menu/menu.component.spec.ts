import { ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing'
import { MenuComponent } from './menu.component'
import { BrowserModule, By } from '@angular/platform-browser'
import { translateModuleLoader } from 'src/app/app.module'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MenuSearchPipe } from './pipe/search.pipe'
import { HttpClientModule } from '@angular/common/http'
import { MenuModel } from './model/menu'
import { MostVisitedMenusService } from '../../services/socket.service'
import { ElementRef, Component } from '@angular/core'
import { Location } from '@angular/common'

let mostVisitedMenusServiceStub = jasmine.createSpyObj('mostVisitedMenusService', ['emit'])

let menuModelStub: Partial<MenuModel>
menuModelStub = {
  data: []
}

// create a dummy component for routing
@Component({
  template: '<div></div>'
})
class DummyComponent {}

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
        RouterTestingModule.withRoutes([
          { path: 'dummy-component', component: DummyComponent }
        ]),
        translateModuleLoader,
        HttpClientModule,
        FontAwesomeModule
      ],
      declarations: [
        MenuComponent,
        DummyComponent,
        MenuSearchPipe
      ],
      providers: [
        { provide: MenuModel, useValue: menuModelStub },
        { provide: MostVisitedMenusService, useValue: mostVisitedMenusServiceStub }
      ]
    })

    fixture = TestBed.createComponent(MenuComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement
    component.initMostVisitedMenus = jasmine.createSpy('initMostVisitedMenus')
    menuModel = fixture.debugElement.injector.get(MenuModel)

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should be hidden first', () => {
    expect(component.hidden).toEqual(true)
    expect(compiled.query(By.css('.menu')).nativeElement.style.display).toEqual('none')
  })

  it('should show when toggled', () => {
    component.toggle()

    fixture.detectChanges()

    expect(compiled.query(By.css('.menu')).nativeElement.style.display).toEqual('block')
  })

  it('should ref the menu element', () => {
    expect(component.menu instanceof ElementRef).toBeTruthy()
  })

  it('should check for most visited menus', () => {
    expect(component.initMostVisitedMenus).toHaveBeenCalledTimes(1)
    expect(component.mostVisitedMenus.length).toBeDefined()
  })

  it('should have icons attribute', () => {
    expect(Object.keys(component.icons).length).toBeGreaterThan(0)
  })

  it('should show the menu items', () => {
    menuModel.data = [
      { id: 1, path: 'viekr', title: 'VIEKR', icon: 'faArchive' },
      { id: 2, path: 'overpayment-inclusion', title: 'Túlfizetés beszámítás', icon: 'faListAlt' }
    ]

    fixture.detectChanges()

    let menuItems = compiled.nativeElement.querySelectorAll('.menu-item')

    expect(menuItems.length).toEqual(2)
    expect(menuItems[0].childNodes[0].classList.value).toBe('ng-fa-icon')
    expect(menuItems[0].childNodes[1].classList.value).toBe('title')
    expect(menuItems[0].childNodes[1].textContent).toBe('VIEKR')
  })

  it('should handle searching', () => {
    menuModel.data = [
      { id: 1, path: 'viekr', title: 'VIEKR', icon: 'faArchive' },
      { id: 2, path: 'overpayment-inclusion', title: 'Túlfizetés beszámítás', icon: 'faListAlt' }
    ]

    let searchInput = compiled.nativeElement.querySelector('input.search')
    searchInput.value = 'beszámítás'
    searchInput.dispatchEvent(new Event('input'))

    fixture.detectChanges()

    let menuItems = compiled.nativeElement.querySelectorAll('.menu-item')

    expect(menuItems.length).toEqual(1)
    expect(menuItems[0].childNodes[1].textContent).toBe('Túlfizetés beszámítás')
  })

  it('should show most visited menus', () => {
    component.mostVisitedMenus = [
      { id: 1, score: 10, path: 'viekr', title: 'VIEKR', icon: 'faArchive' },
      { id: 2, score: 6, path: 'overpayment-inclusion', title: 'Túlfizetés beszámítás', icon: 'faListAlt' }
    ]

    fixture.detectChanges()

    let mostVisited = compiled.nativeElement.querySelectorAll('.most-visited-menu-item')

    expect(mostVisited.length).toEqual(2)
    expect(mostVisited[0].childNodes[0].classList.value).toBe('ng-fa-icon')
    expect(mostVisited[0].childNodes[1].classList.value).toBe('title')
  })

  it('should handle menu item click',
    fakeAsync( // routing is asynchronous so we need this to call "tick"
      inject( // we inject location and most visited menus service here because we only use them in this test
        [Location, MostVisitedMenusService], (location: Location, mostVisitedMenusService: MostVisitedMenusService) => {
          menuModel.data = [
            { id: 1, path: 'dummy-component', title: 'Dummy Component', icon: 'faArchive' }
          ]

          fixture.detectChanges()

          compiled.query(By.css('.menu-item')).nativeElement.click()

          tick() // routing is asynchronous so we have to tick (wait)

          expect(location.path()).toBe('/dummy-component')
          expect(mostVisitedMenusService.emit).toHaveBeenCalledTimes(1)
        }
      )
    )
  )
})
