import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { MaterialModule } from "../../material/material.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpServicesService } from '../../http-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  imports: [MatCard, MaterialModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
 forgetForm: FormGroup;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    public http: HttpServicesService,
    private snackBar: MatSnackBar,
    private readonly _router: Router
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['',[Validators.required,]] 
    });
  }

  generateOtp() {
    const emailControl = this.forgetForm.get('email');

    if (!emailControl || emailControl.invalid) {
      this.snackBar.open('Enter a valid email address', '', { duration: 2500 });
      return;
    }

    const data = {
      email: emailControl.value
    };

    this.http.checkEmail(data).subscribe({
      next: () => {
        this.otpSent = true;

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
    if (this.forgetForm.invalid) {
      this.forgetForm.markAllAsTouched();
      return;
    }

    const formdata = this.forgetForm.value;

    this.http.resetPassword(formdata).subscribe({
      next: () => {
        this.snackBar.open('Password Reset Successfully 🎉', '', { duration: 2500 });

        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 2500);
      },
      error: (error: any) => {
        this.snackBar.open(
          error?.error?.message || 'reset password failed',
          '',
          { duration: 2500 }
        );
      }
    });
  }
}
