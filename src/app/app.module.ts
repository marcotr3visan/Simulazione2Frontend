import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeIt from '@angular/common/locales/it';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { authInterceptor } from './utils/auth.interceptor';
//import { logoutInterceptor } from './utils/logout.interceptor';
import { IfAuthenticatedDirective } from './utils/if-authenticated.directive';
import { RegistrationComponent } from './pages/registration/registration.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { HomeComponent } from './pages/home/home.component';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { AreaOperatoreComponent } from './pages/area-operatore/area-operatore.component';
import { StatisticheComponent } from './pages/statistiche/statistiche.component';
registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    IfAuthenticatedDirective,
    NavbarComponent,
    NavUserComponent,
    HomeComponent,
    TrackingComponent,
    AreaOperatoreComponent,
    StatisticheComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, 
        //logoutInterceptor
      ])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
