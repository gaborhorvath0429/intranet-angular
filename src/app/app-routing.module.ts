import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './core/components/login/login.component'
import { AuthGuard } from './core/guards/auth-guard.guard'
import { OverpaymentInclusionComponent } from './module/overpayment-inclusion/overpayment-inclusion.component'
import { ViekrComponent } from './module/viekr/viekr.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'overpayment-inclusion', component: OverpaymentInclusionComponent, canActivate: [AuthGuard] },
  { path: 'viekr', component: ViekrComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
