import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { SocketIoModule } from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { RequestInterceptor } from './core/services/authentication.service'
import { LoginComponent } from './core/components/login/login.component'
import { GridComponent } from './core/components/grid/grid.component'
import { OverpaymentInclusionComponent } from './module/overpayment-inclusion/overpayment-inclusion.component'
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
import { EditorModule } from '@tinymce/tinymce-angular'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { MenuComponent } from './core/components/menu/menu.component'
import { HeaderComponent } from './core/components/header/header.component'
import { MenuSearchPipe } from './core/components/menu/pipe/search.pipe'
import { NotificationsComponent } from './core/components/notifications/notifications.component'
import { CdkTreeModule } from '@angular/cdk/tree'
import { RegulationComponent } from './module/regulation/regulation.component'
import { MenuListComponent } from './core/components/menu-list/menu-list.component'

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, 'assets/locales/', '.js')
}

export const dpOptions: IAngularMyDpOptions = {
  dateRange: false,
  dateFormat: 'yyyy-mm-dd'
}

export const translateModuleLoader = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient]
  }
})

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
    MenuSearchPipe,
    TabPanelComponent,
    TabComponent,
    ComboBoxComponent,
    SearchPipe,
    ConfirmComponent,
    ViekrAttachmentComponent,
    CheckboxGroupComponent,
    ViekrMessageComponent,
    MenuComponent,
    HeaderComponent,
    NotificationsComponent,
    RegulationComponent,
    MenuListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    translateModuleLoader,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule,
    FontAwesomeModule,
    AngularMyDatePickerModule,
    NgxExtendedPdfViewerModule,
    EditorModule,
    CdkTreeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export interface ApiResponse<T> {
  success: boolean
  message?: string
  root?: T[]
  record?: T
}
