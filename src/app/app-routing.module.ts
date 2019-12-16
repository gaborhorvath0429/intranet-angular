import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './core/components/login/login.component'
import { AuthGuard } from './core/guards/auth-guard.guard'
import { OverpaymentInclusionComponent } from './module/overpayment-inclusion/overpayment-inclusion.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: OverpaymentInclusionComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
