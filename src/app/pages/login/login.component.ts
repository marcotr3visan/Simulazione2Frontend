import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '../../services/jwt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, catchError, throwError, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected destroyed$ = new Subject<void>();

  loginForm = this.fb.group({
    Email: ['', [Validators.required, Validators.email]],
    Password: ['', Validators.required]
  });

  loginError = '';
  requestedUrl: string | null = null;

  ngOnInit() {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => (this.loginError = ''));

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.requestedUrl = params['requestedUrl'] || null;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    const { Email, Password } = this.loginForm.value;

    if (!Email || !Password) {
      this.loginError = 'Email e Password sono obbligatorie';
      return;
    }

    this.authSrv.login(Email, Password)
      .pipe(
        catchError(err => {
          this.loginError = err?.error?.message || 'Credenziali non valide';
          return throwError(() => err);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.router.navigate(['/area-operatore']);
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
