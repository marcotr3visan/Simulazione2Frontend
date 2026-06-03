import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  registrationError = '';
  isSubmitting = false;

  private destroyed$ = new Subject<void>();
  protected fb = inject(FormBuilder);

  constructor(
    private authSrv: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    this.registrationForm = this.fb.group({
      Nome: ['', Validators.required],
      Cognome: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern(passwordPattern)]]
    });

    this.registrationForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.registrationError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.registrationError = '';
    this.isSubmitting = true;

    const { Nome, Cognome, Email, Password } = this.registrationForm.getRawValue();

    this.authSrv.register(Nome, Cognome, Email, Password)
  .pipe(
    takeUntil(this.destroyed$),
    catchError(err => {
      console.error('REGISTER ERROR', err);
      this.isSubmitting = false;
      this.registrationError = err?.error?.message || 'Errore durante la registrazione.';
      return throwError(() => err);
    })
  )
  .subscribe({
    next: (res) => {
      console.log('REGISTER OK', res);
      this.isSubmitting = false;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('SUBSCRIBE ERROR', err);
    }
  });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}