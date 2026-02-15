import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

import { HttpServicesService } from '../../http-services.service';
import { ShopDialogComponent } from '../shop-dialog/shop-dialog.component';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  plans: any[] = [];
  activeSubscription: any = null;

  shop: any = null;

  qrCode: SafeUrl | null = null;
  qrAmount: number | null = null;
  paymentId: number | null = null;

  paymentStatus: 'PENDING' | 'USER_CONFIRMED' | null = null;

  loadingQR = false;
  confirmingPayment = false;

  token = localStorage.getItem('token') || '';

  constructor(
    private api: HttpServicesService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.loadPlans();
    this.loadMySubscription();
    this.loadShop();
  }

  loadPlans() {
    this.api.getAllSubscriptions().subscribe(res => {
      this.plans = res;
    });
  }

  loadMySubscription() {
    if (!this.token) return;

    this.api.getMySubscription(this.token).subscribe({
      next: res => this.activeSubscription = res,
      error: () => this.activeSubscription = null
    });
  }

  loadShop() {
    this.shopService.getShop().subscribe({
      next: res => this.shop = res,
      error: () => this.shop = null
    });
  }

  /* SUBSCRIBE */
  subscribe(planId: number) {
    this.loadingQR = true;

    this.api.generateQR(planId, this.token).subscribe({
      next: (res: any) => {
        this.qrCode = this.sanitizer.bypassSecurityTrustUrl(res.qrCode);
        this.qrAmount = res.amount;
        this.paymentId = res.paymentId;
        this.paymentStatus = 'PENDING';
        this.loadingQR = false;
      },
      error: err => {
        alert(err.error.message);
        this.loadingQR = false;
      }
    });
  }

  /* USER CONFIRM */
  confirmPayment() {
    if (!this.paymentId) return;

    this.confirmingPayment = true;

    this.api.userConfirmPayment(this.paymentId, this.token).subscribe({
      next: () => {
        this.paymentStatus = 'USER_CONFIRMED';
        this.confirmingPayment = false;
      },
      error: () => this.confirmingPayment = false
    });
  }

  closeQR() {
    this.qrCode = null;
    this.qrAmount = null;
    this.paymentId = null;
    this.paymentStatus = null;
  }

  /* SHOP DIALOG */
  openShopDialog() {
    if (!this.activeSubscription) {
      alert('Please activate subscription first');
      return;
    }

    this.dialog.open(ShopDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        shop: this.shop
      }
    }).afterClosed().subscribe(refresh => {
      if (refresh) {
        this.loadShop();
      }
    });
  }
}
