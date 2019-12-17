import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { CredentialsProvider } from './core/services/authentication.service'
import { LoginComponent } from './core/components/login/login.component'
import { GridComponent } from './core/components/grid/grid.component'
import { OverpaymentInclusionComponent } from './module/overpayment-inclusion/overpayment-inclusion.component'
import { NotificationService, GridViewService, MostVisitedMenusService } from './core/services/socket.service'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GridComponent,
    OverpaymentInclusionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsProvider,
      multi: true
    },
    NotificationService,
    GridViewService,
    MostVisitedMenusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
