import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../product.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }
  ],
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  form!: FormGroup;

  units = [
    { label: 'Pieces', value: 'PCS' },
    { label: 'Kilogram', value: 'KG' },
    { label: 'Liter', value: 'LITER' }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      unit: ['PCS', Validators.required],
      expiry_date: ['']
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

 submit() {
  if (this.form.invalid) return;

  const apiCall = this.data
    ? this.productService.updateProduct(this.data.id, this.form.value)
    : this.productService.addProduct(this.form.value);

  apiCall.subscribe({
    next: () => this.dialogRef.close(true),
    error: (err) => {
      if (err.status === 403) {
        alert('Subscription required to add / update products');
      } else {
        alert('Something went wrong');
      }
    }
  });
}


  cancel() {
    this.dialogRef.close(false);
  }
}
