import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShopService } from '../../shop.service';
import { MaterialModule } from "../../material/material.module";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-dialog',
  templateUrl: './shop-dialog.component.html',
  styleUrls: ['./shop-dialog.component.scss'],
  imports: [MaterialModule,CommonModule,ReactiveFormsModule]
})
export class ShopDialogComponent implements OnInit {

  isEdit = false;
  loading = false;
  shopForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private dialogRef: MatDialogRef<ShopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.shopForm = this.fb.group({
      shop_name: ['', Validators.required],
      address: [''],
      upi_id: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w.-]+@[\w.-]+$/)
        ]
      ],
      mobile_number:['']
    });

    if (this.data?.shop) {
      this.isEdit = true;
      this.shopForm.patchValue(this.data.shop);
    }
  }

  submit() {
    if (this.shopForm.invalid) return;

    this.loading = true;

    const apiCall = this.isEdit
      ? this.shopService.updateShop(this.shopForm.value)
      : this.shopService.createShop(this.shopForm.value);

    apiCall.subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        alert('Updated Successfully')
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Something went wrong');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
