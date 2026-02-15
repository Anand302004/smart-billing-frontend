import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BillingService } from '../../billing.service';
import { ShopService } from '../../shop.service';
import { forkJoin } from 'rxjs';

import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-billing-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-print.component.html',
  styleUrls: ['./billing-print.component.scss']
})
export class BillingPrintComponent implements OnInit {

  bill: any;
  shop: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private billingService: BillingService,
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit() {
    const billId = Number(this.route.snapshot.paramMap.get('billId'));

    forkJoin({
      bill: this.billingService.getBillById(billId),
      shop: this.shopService.getShop()
    }).subscribe(res => {
      this.bill = res.bill;
      this.shop = res.shop;
      this.loading = false;
    });
  }

  /* ===== ACTIONS ===== */

  printBill() {
    window.print();
  }

  downloadPdf() {
    const element = document.getElementById('receipt');
    if (!element) return;

    const options = {
      margin: 0,
      filename: `Bill_${this.bill.id}.pdf`,
      image: { type: 'jpeg' as 'jpeg', quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: {
        unit: 'mm' as 'mm',
        format: 'a4' as 'a4',
        orientation: 'portrait' as 'portrait'
      }
    };

    html2pdf().from(element).set(options).save();
  }

  goBack() {
    this.router.navigate(['/users/billing/history']);
  }

  /* ===== CALCULATIONS ===== */

  get totalAmount(): number {
    return Number(this.bill?.total_amount || 0) +
           Number(this.bill?.discount_amount || 0);
  }

  get discountAmount(): number {
    return Number(this.bill?.discount_amount || 0);
  }

  get payableAmount(): number {
    return Number(this.bill?.total_amount || 0);
  }
}
