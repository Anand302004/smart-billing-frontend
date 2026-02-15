import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BillingService } from '../../billing.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {

  bills: any[] = [];
  loading = true;

  fromDate = '';
  toDate = '';
  paymentMode = '';

  constructor(
    private billingService: BillingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;
    if (this.paymentMode) params.mode = this.paymentMode;

    this.billingService.getBillingHistory(params).subscribe({
      next: res => { this.bills = res; this.loading = false;  },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  printBill(id: number) {
    this.router.navigate(
      ['users/billing/print', id],
      { state: { from: 'history' } }
    );
  }

  exportPdf() {
    this.billingService.exportPdf({
      from: this.fromDate,
      to: this.toDate,
      mode: this.paymentMode
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'billing-history.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => { console.error(err); alert('PDF export failed'); }
    });
  }
}
