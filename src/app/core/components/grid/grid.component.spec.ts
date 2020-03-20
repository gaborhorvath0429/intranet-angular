import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GridComponent } from './grid.component'
import { ModalService } from '../../services/modal-service.service'
import { ChangeDetectorRef, DebugElement, ElementRef } from '@angular/core'
import { TabComponent } from '../tab-panel/tab/tab.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { translateModuleLoader } from 'src/app/app.module'
import { FormsModule } from '@angular/forms'
import { BrowserModule, By } from '@angular/platform-browser'
import { PaginatorComponent } from './paginator/paginator.component'
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component'
import { ButtonComponent } from '../button/button.component'
import { ModalComponent } from '../modal/modal.component'
import { DatePickerComponent } from '../input/date-picker/date-picker.component'
import { FilterItemsSearchPipe } from './pipe/filter-items-search.pipe'
import { AngularMyDatePickerModule } from 'angular-mydatepicker'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { PaymentModel } from '../../../module/overpayment-inclusion/model/payment'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { MenuModel } from '../menu/model/menu'
/* tslint:disable */
const data = [
  {'OP_INCLUSION_ID':241,'OP_CEID':10457371,'INCL_CEID':10249150,'INCLUSION_DATE':'2016.07.07','INCLUSION_AMOUNT':20000,'AFTER_INCLUSION_BALANCE':78580},
  {'OP_INCLUSION_ID':461,'OP_CEID':10824829,'INCL_CEID':10517664,'INCLUSION_DATE':'2016.07.15','INCLUSION_AMOUNT':6000,'AFTER_INCLUSION_BALANCE':42799},
  {'OP_INCLUSION_ID':481,'OP_CEID':11043758,'INCL_CEID':11040720,'INCLUSION_DATE':'2016.07.18','INCLUSION_AMOUNT':95,'AFTER_INCLUSION_BALANCE':186780},
  {'OP_INCLUSION_ID':482,'OP_CEID':10603689,'INCL_CEID':10603690,'INCLUSION_DATE':'2016.07.18','INCLUSION_AMOUNT':107,'AFTER_INCLUSION_BALANCE':309313},
  {'OP_INCLUSION_ID':581,'OP_CEID':11040621,'INCL_CEID':11040282,'INCLUSION_DATE':'2016.07.25','INCLUSION_AMOUNT':54,'AFTER_INCLUSION_BALANCE':891365},
]
/* tslint:enable */
const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get'])
httpClientStub.get.and.returnValue({
  pipe: () => of(data)
})
let modalServiceStub = jasmine.createSpyObj('modalService', ['add', 'remove'])
let routerStub = jasmine.createSpy('Router')
let menuModelStub = jasmine.createSpyObj('menuModel', ['load'])

const model = new PaymentModel(httpClientStub)

describe('GridComponent', () => {
  let component: GridComponent
  let fixture: ComponentFixture<GridComponent>
  let compiled: DebugElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridComponent,
        TabComponent,
        PaginatorComponent,
        ButtonComponent,
        ToolbarButtonComponent,
        ModalComponent,
        DatePickerComponent,
        FilterItemsSearchPipe
      ],
      imports: [
        FontAwesomeModule,
        translateModuleLoader,
        BrowserModule,
        FormsModule,
        AngularMyDatePickerModule,
        HttpClientModule
      ],
      providers: [
        { provide: MenuModel, useValue: menuModelStub },
        { provide: ModalService, useValue: modalServiceStub },
        { provide: Router, useValue: routerStub },
        ChangeDetectorRef
      ]
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement

    component.model = model

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should ref the table', () => {
    expect(component.table instanceof ElementRef).toBeTruthy()
  })

  it('should show all rows', () => {
    expect(compiled.queryAll(By.css('.data-row')).length).toBe(5)
  })

  it('should have toolbar and it is hidden first', () => {
    let toolbar = compiled.query(By.css('.toolbar'))
    expect(toolbar).toBeTruthy()
    expect(toolbar.nativeElement.style.display).toBe('none')
  })

  it('should show paginator in toolbar if set', () => {
    expect(component.paginator).toBe(false)
    expect(compiled.query(By.directive(PaginatorComponent))).toBeFalsy()

    component.paginator = true

    fixture.detectChanges()

    expect(compiled.query(By.css('.toolbar')).nativeElement.style.display).toBe('block')
    expect(compiled.query(By.directive(PaginatorComponent))).toBeTruthy()
  })

  it('should show checkboxes if selectionModel is set to checkbox-model', () => {
    expect(component.selectionModel).toBe('single')

    component.selectionModel = 'checkbox'

    fixture.detectChanges()

    expect(compiled.query(By.css('.selection-checkbox'))).toBeTruthy()
  })

  it('should handle selection in single model', () => {
    compiled.queryAll(By.css('.data-row'))[0].nativeElement.click()
    expect(component.selection.length).toBe(1)
    expect(component.selection[0]).toBe(data[0])

    compiled.queryAll(By.css('.data-row'))[1].nativeElement.click()
    expect(component.selection.length).toBe(1)
    expect(component.selection[0]).toBe(data[1])
  })

  it('should handle selection in checkbox model', () => {
    component.selectionModel = 'checkbox'

    fixture.detectChanges()

    compiled.queryAll(By.css('.data-row'))[0].nativeElement.click()
    expect(component.selection.length).toBe(1)
    expect(component.selection[0]).toEqual(data[0])

    compiled.queryAll(By.css('.data-row'))[1].nativeElement.click()
    expect(component.selection.length).toBe(2)
    expect(component.selection).toEqual([data[0], data[1]])

    compiled.queryAll(By.css('.data-row'))[0].nativeElement.click()
    expect(component.selection.length).toBe(1)
    expect(component.selection[0]).toEqual(data[1])
  })
})
