import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './utils/auth.guard';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomeComponent } from './pages/home/home.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { AreaOperatoreComponent } from './pages/area-operatore/area-operatore.component';
import { StatisticheComponent } from './pages/statistiche/statistiche.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'tracking',
    component: TrackingComponent
  },
  {
    path: 'area-operatore',
    component: AreaOperatoreComponent,
    canActivate: [authGuard]
  },
  {
    path: 'statistiche',
    component: StatisticheComponent,
    canActivate: [authGuard]
  },
  {
    path:'',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
