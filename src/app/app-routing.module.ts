import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './core/components/login/login.component'
import { AuthGuard } from './core/guards/auth-guard.guard'
import { RegulationComponent } from './module/regulation/regulation.component'
import { ExtjsComponent } from './core/components/extjs/extjs.component'

export const extjsRoutes = [
  'authentication',
  'logout',
  'autoreport',
  'back-office',
  'bank-account-loader',
  'complaint',
  'dialer',
  'executor-costs-loader',
  'human-resource-events',
  'fee-loader',
  'file-uploader',
  'field-visit-generator',
  'interest-calc',
  'manage-queues',
  'module',
  'group-management',
  'user-management',
  'overpayment-inclusion',
  'report',
  'viekr',
  'cross-border-loader',
  'cross-border-uploader',
  'ksi-letter-delete',
  'faktor-group-modifier',
  'commerzbank-transfer-accountant',
  'unident-payment',
  'advance-fee-uploader',
  'vh-visits'
]

const routes: Routes = [
  ...extjsRoutes.map(route => ({ path: route, component: ExtjsComponent, canActivate: [AuthGuard] })),
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'regulation', component: RegulationComponent, canActivate: [AuthGuard] },
  { path: 'regulation/:id', component: RegulationComponent, canActivate: [AuthGuard] }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
