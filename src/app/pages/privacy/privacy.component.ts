import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { HttpServicesService } from '../../http-services.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {

  message = '';
  activeTab: 'update' | 'block' = 'update';

  updateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: HttpServicesService
  ) {
    // ✅ FIX: fb initialization error solved
    this.updateForm = this.fb.group({
      name: [''],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.minLength(6)]
    });
  }

  // ================= SWITCH TAB =================
  showUpdate() {
    this.activeTab = 'update';
    this.message = '';
  }

  showBlock() {
    this.activeTab = 'block';
    this.message = '';
  }

  // ================= UPDATE ACCOUNT =================
  updateAccount() {

    if (this.updateForm.invalid) return;

    this.api.updateAccount(this.updateForm.value)
      .subscribe({
        next: (res:any) => {

          this.message = res.message;

          // optional UI update
          localStorage.setItem('user',
            JSON.stringify(res.user)
          );

          this.updateForm.reset();
        },
        error: (err) => {
          this.message =
            err.error?.message || "Update failed";
        }
      });
  }
}
