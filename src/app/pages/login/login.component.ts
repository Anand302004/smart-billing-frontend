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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    public http: HttpServicesService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formdata = this.loginForm.value;

    this.http.login(formdata).subscribe({
      next: (res: any) => {
        if (!res?.accessToken || !res?.user) {
          this.snackBar.open('Invalid login response', '', { duration: 2500 });
          return;
        }

       localStorage.setItem('token', res.accessToken);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('user', JSON.stringify(res.user));

        if (res.user.role === 'admin') {
          this.snackBar.open('Login successful Admin 🎉', '', { duration: 2000 });

          setTimeout(() => {
            this._router.navigate(['/admin/dashboard']);
          }, 2000);

        } else {
          this.snackBar.open('Login successful 🎉', '', { duration: 2000 });

          setTimeout(() => {
            this._router.navigate(['/users/dashboard']); // user panel
          }, 2000);
        }
      },
      error: (error: any) => {
        this.snackBar.open(
          error?.error?.message || 'Login failed',
          '',
          { duration: 2500 }
        );
      }
    });
  }
}

