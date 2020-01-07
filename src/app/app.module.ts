import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { SocketIoModule } from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { RequestInterceptor } from './core/services/authentication.service'
import { LoginComponent } from './core/components/login/login.component'
import { GridComponent } from './core/components/grid/grid.component'
import { OverpaymentInclusionComponent } from './module/overpayment-inclusion/overpayment-inclusion.component'
import { NotificationService, GridViewService, MostVisitedMenusService } from './core/services/socket.service'
import { SavedViewsDirective } from './core/components/grid/directive/saved-views.directive'
import { ToolbarButtonComponent } from './core/components/grid/toolbar-button/toolbar-button.component'
import { ModalComponent } from './core/components/modal/modal.component'
import { ButtonComponent } from './core/components/button/button.component'
import { PaginatorComponent } from './core/components/grid/paginator/paginator.component'
import { ShowPaginatorDirective } from './core/components/grid/directive/show-paginator.directive'
import { ShowFiltersDirective } from './core/components/grid/directive/show-filters.directive'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AngularMyDatePickerModule } from 'angular-mydatepicker'
import { DatePickerComponent } from './core/components/input/date-picker/date-picker.component'
import { CeidInputDirective } from './core/components/input/directives/ceid-input.directive'
import { FormInputDirective } from './core/components/input/directives/form-input.directive'
import { MessageComponent } from './core/components/modal/message/message.component';
import { ViekrComponent } from './module/viekr/viekr.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GridComponent,
    OverpaymentInclusionComponent,
    SavedViewsDirective,
    ToolbarButtonComponent,
    ModalComponent,
    ButtonComponent,
    PaginatorComponent,
    ShowPaginatorDirective,
    ShowFiltersDirective,
    DatePickerComponent,
    CeidInputDirective,
    FormInputDirective,
    MessageComponent,
    ViekrComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule,
    FontAwesomeModule,
    AngularMyDatePickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    NotificationService,
    GridViewService,
    MostVisitedMenusService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }

export interface ApiResponse {
  success: boolean
  message?: string
  root?: any
}
