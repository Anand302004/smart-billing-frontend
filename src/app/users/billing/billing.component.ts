import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../../billing.service';
import { ProductService } from '../../product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  billItems: any[] = [];

  searchText = '';
  discountPercent = 0;

  total = 0;
  finalTotal = 0;
  creatingBill = false;

  billId: number | null = null;

  qrCode: SafeUrl | null = null;
  qrAmount = 0;
  paymentId: number | null = null;
  upiTxnId = '';

  constructor(
    private productService: ProductService,
    private billingService: BillingService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.restoreBillingState(); // ✅ restore on reload
  }

  /* ===============================
     LOCAL STORAGE SAVE / RESTORE
  =============================== */

  saveBillingState() {
    const state = {
      billItems: this.billItems,
      discountPercent: this.discountPercent,
      billId: this.billId
    };

    localStorage.setItem('billing_state', JSON.stringify(state));
  }

  restoreBillingState() {
    const saved = localStorage.getItem('billing_state');
    if (!saved) return;

    const state = JSON.parse(saved);

    this.billItems = state.billItems || [];
    this.discountPercent = state.discountPercent || 0;
    this.billId = state.billId || null;

    this.calculateTotal();
  }

  clearBillingState() {
    localStorage.removeItem('billing_state');
  }

  /* ===============================
     PRODUCTS
  =============================== */

  loadProducts() {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res.products;
      this.filteredProducts = res.products;
    });
  }

  searchProducts() {
    const t = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(t)
    );
  }

  addToBill(p: any) {

  const item = this.billItems.find(i => i.id === p.id);

  const isPiece = p.unit === 'PCS';
  const defaultQty = isPiece ? 1 : 0.5;

  if (item) {

    if (item.quantity >= p.quantity) return;

    item.quantity += isPiece ? 1 : 0.5;
    item.total = item.quantity * item.price;

  } else {

    this.billItems.push({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      quantity: defaultQty,
      maxQty: p.quantity,
      unit: p.unit,
      step: isPiece ? 1 : 0.01,
      total: Number(p.price) * defaultQty
    });
  }

  this.calculateTotal();
}


  updateQty(item: any) {

  item.quantity = Number(item.quantity);

  // pcs → integer only
  if (item.unit === 'pcs') {
    item.quantity = Math.floor(item.quantity);
    if (item.quantity < 1) item.quantity = 1;
  }

  // weight items
  if (item.unit !== 'pcs' && item.quantity <= 0) {
    item.quantity = 0.01;
  }

  if (item.quantity > item.maxQty) {
    item.quantity = item.maxQty;
  }

  item.total = item.quantity * item.price;

  this.calculateTotal();
}


  removeItem(item: any) {
    this.billItems = this.billItems.filter(i => i.id !== item.id);

    this.calculateTotal();
    this.saveBillingState(); // ✅ auto save
  }

  calculateTotal() {
    this.total = this.billItems.reduce((s, i) => s + i.total, 0);
    const discount = (this.total * this.discountPercent) / 100;
    this.finalTotal = Math.max(this.total - discount, 0);

    this.saveBillingState(); // ✅ auto save
  }

  /* ===============================
     BILL CREATION
  =============================== */

  createBill() {
    this.creatingBill = true;

    const payload = {
      items: this.billItems.map(i => ({
        product_id: i.id,
        quantity: i.quantity
      })),
      discount_percent: this.discountPercent
    };

    this.billingService.createBill(payload).subscribe((res: any) => {
      this.billId = res.billId;
      this.creatingBill = false;
      this.saveBillingState(); // ✅ save billId too
    });
  }

  /* ===============================
     PAYMENT
  =============================== */

  payByUPI() {
    if (!this.billId) return;

    this.billingService.generateQR(this.billId, this.finalTotal)
      .subscribe((res: any) => {
        this.qrCode = this.sanitizer.bypassSecurityTrustUrl(res.qrCode);
        this.qrAmount = res.amount;
        this.paymentId = res.paymentId;
      });
  }

  confirmUPI() {
    if (!this.paymentId || !this.upiTxnId) return;

    this.billingService.confirmUPI(this.paymentId, this.upiTxnId)
      .subscribe(() => {

        if (!this.billId) return;

        alert('Payment Successful');

        this.clearBillingState(); // ✅ clear after success

        this.router.navigate(['/users/billing/print', this.billId]);
      });
  }

  payByCash() {
    if (!this.billId) return;

    this.billingService.cashPayment(this.billId)
      .subscribe(() => {

        if (!this.billId) return;

        alert('Payment Successful');

        this.clearBillingState(); // ✅ clear after success

        this.router.navigate(['/users/billing/print', this.billId]);
      });
  }

  closeQR() {
    this.qrCode = null;
    this.upiTxnId = '';
  }

  resetBilling() {
    this.billItems = [];
    this.billId = null;
    this.discountPercent = 0;
    this.total = 0;
    this.finalTotal = 0;

    this.clearBillingState(); // ✅ clear storage
  }
}
