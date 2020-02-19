import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NotificationsComponent } from './notifications.component'
import { DebugElement } from '@angular/core'

describe('NotificationsComponent', () => {
  let component: NotificationsComponent
  let fixture: ComponentFixture<NotificationsComponent>
  let compiled: DebugElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
