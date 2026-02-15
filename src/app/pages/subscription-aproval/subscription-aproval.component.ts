import { Component, OnInit } from '@angular/core';
import { HttpServicesService } from '../../http-services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription-aproval',
  imports: [CommonModule],
  templateUrl: './subscription-aproval.component.html',
  styleUrl: './subscription-aproval.component.scss'
})
export class SubscriptionAprovalComponent implements OnInit {

  pendingPayments: any[] = [];

  constructor(private httpService: HttpServicesService) {}

  ngOnInit(): void {
    this.fetchPendingPayments();
  }

  fetchPendingPayments() {
    this.httpService.getPendingPayments().subscribe(
      res => this.pendingPayments = res,
      err => console.error(err)
    );
  }

  approve(paymentId: number) {
    this.httpService.approvePayment(paymentId).subscribe(
      () => {
        alert('Payment approved & subscription activated!');
        this.fetchPendingPayments(); // refresh list
      },
      err => console.error(err)
    );
  }
  reject(paymentId: number) {
    this.httpService.rejectPayment(paymentId).subscribe(
      () => {
        alert('Request Rejected');
        this.fetchPendingPayments(); // refresh list
      },
      err => console.error(err)
    );
  }
}
