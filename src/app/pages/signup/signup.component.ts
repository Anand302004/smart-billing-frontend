import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCard } from "@angular/material/card";
import { HttpServicesService } from '../../http-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatCard
],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  
  signupForm: FormGroup;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    public http: HttpServicesService,
    private snackBar: MatSnackBar,
    private readonly _router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: [''] // ❗ initially not required
    });
  }

  generateOtp() {
    const emailControl = this.signupForm.get('email');

    if (!emailControl || emailControl.invalid) {
      this.snackBar.open('Enter a valid email address', '', { duration: 2500 });
      return;
    }

    const data = {
      email: emailControl.value
    };

    this.http.sendOTP(data).subscribe({
      next: () => {
        this.otpSent = true;

        // OTP required only after send
        this.signupForm.get('otp')?.setValidators([Validators.required]);
        this.signupForm.get('otp')?.updateValueAndValidity();

        this.snackBar.open('OTP sent to your email 📩', '', { duration: 2500 });
      },
      error: (error: any) => {
        this.snackBar.open(
          error?.error?.message || 'Failed to send OTP',
          '',
          { duration: 2500 }
        );
      }
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formdata = this.signupForm.value;

    this.http.signup(formdata).subscribe({
      next: () => {
        this.snackBar.open('Signup successful 🎉', '', { duration: 2500 });

        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 2500);
      },
      error: (error: any) => {
        this.snackBar.open(
          error?.error?.message || 'Signup failed',
          '',
          { duration: 2500 }
        );
      }
    });
  }
}


