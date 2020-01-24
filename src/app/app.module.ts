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
import { PaginatorDirective } from './core/components/grid/directive/paginator.directive'
import { FiltersDirective } from './core/components/grid/directive/filters.directive'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AngularMyDatePickerModule, IAngularMyDpOptions } from 'angular-mydatepicker'
import { DatePickerComponent } from './core/components/input/date-picker/date-picker.component'
import { CeidInputDirective } from './core/components/input/directives/ceid-input.directive'
import { FormInputDirective } from './core/components/input/directives/form-input.directive'
import { MessageComponent } from './core/components/modal/message/message.component'
import { ViekrComponent } from './module/viekr/viekr.component'
import { FilterItemsSearchPipe } from './core/components/grid/pipe/filter-items-search.pipe'
import { TabPanelComponent } from './core/components/tab-panel/tab-panel.component'
import { TabComponent } from './core/components/tab-panel/tab/tab.component'
import { ComboBoxComponent } from './core/components/input/combo-box/combo-box.component'
import { SearchPipe } from './core/components/input/combo-box/combo-search.pipe'
import { ConfirmComponent } from './core/components/modal/confirm/confirm.component'
import { ViekrAttachmentComponent } from './module/viekr/window/attachment/attachment.component'
import { ViekrMessageComponent } from './module/viekr/window/message/message.component'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { CheckboxGroupComponent } from './core/components/input/checkbox-group/checkbox-group.component'

export const dpOptions: IAngularMyDpOptions = {
  dateRange: false,
  dateFormat: 'yyyy-mm-dd'
}

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
    PaginatorDirective,
    FiltersDirective,
    DatePickerComponent,
    CeidInputDirective,
    FormInputDirective,
    MessageComponent,
    ViekrComponent,
    FilterItemsSearchPipe,
    TabPanelComponent,
    TabComponent,
    ComboBoxComponent,
    SearchPipe,
    ConfirmComponent,
    ViekrAttachmentComponent,
    CheckboxGroupComponent,
    ViekrMessageComponent
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
    AngularMyDatePickerModule,
    NgxExtendedPdfViewerModule,
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
