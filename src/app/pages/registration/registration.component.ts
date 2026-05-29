import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  registrationForm!: FormGroup;

  registrationError = '';
  
    private destroyed$ = new Subject<void>();
  
    constructor(private authSrv: AuthService,
                private router: Router) { }
      
    protected fb = inject(FormBuilder);
                
    ngOnInit(): void {
    const passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;

    this.registrationForm = this.fb.group({
      Nome: ['', Validators.required],
      Cognome: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Role: ['', Validators.required],
      Password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
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
  
    register() {
      if (this.registrationForm.valid) {
        const { Nome, Cognome, Email, Role, Password} = this.registrationForm.value;
        this.authSrv.register(Nome!, Cognome!, Email!, Role!, Password!,)
          .pipe(
            catchError(err => {
              this.registrationError = err.error.message;
              return throwError(() => err);   
            })
          )
          .subscribe(() => {
            this.router.navigate(['/login']);
          });
      }
    }

    goToLogin() {
      this.router.navigate(['/login']);
    }
  }
