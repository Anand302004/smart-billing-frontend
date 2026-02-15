import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../sales.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {

  range: '7days' | 'month' | 'lifetime' = '7days';
  chartType: 'bar' | 'line' = 'bar';

  chartLabels: string[] = [];
  chartData: number[] = [];

  todaySale = 0;
  monthSale = 0;
  lifetimeSale = 0;

  alerts: any = { lowStock: [], expiring: [] };

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTodaySale();
    this.loadMonthSale();
    this.loadLifetimeSale();
    this.loadAlerts();
    this.loadGraph();
  }

  /* ===============================
     SUMMARY LOADERS
  ================================ */

  loadTodaySale() {
    this.salesService.getTodaySummary().subscribe((res: any) => {
      this.todaySale = Number(res.totalSales || 0);
    });
  }

  loadMonthSale() {
  this.salesService.getSalesGraph('month').subscribe(res => {
    const total = res.reduce(
      (sum: number, x: any) => sum + Number(x.total),
      0
    );

    this.monthSale = Number(total.toFixed(2)); // ✅ FIX
  });
}

loadLifetimeSale() {
  this.salesService.getSalesGraph('lifetime').subscribe(res => {
    const total = res.reduce(
      (sum: number, x: any) => sum + Number(x.total),
      0
    );

    this.lifetimeSale = Math.round(total); // ✅ FIX
  });
}

  loadAlerts() {
    this.salesService.getAlerts().subscribe(res => {
      this.alerts = res;
    });
  }

  /* ===============================
     GRAPH
  ================================ */

  loadGraph() {
    this.salesService.getSalesGraph(this.range).subscribe(res => {
      this.chartLabels = this.formatLabels(res);
      this.chartData = res.map(x => Number(x.total));
    });
  }

  formatLabels(data: any[]): string[] {

    // 7 DAYS → DATE
    if (this.range === '7days') {
      return data.map(x =>
        new Date(x.label).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short'
        })
      );
    }

    // MONTH → WEEK
    if (this.range === 'month') {
      return data.map((_, i) => `Week ${i + 1}`);
    }

    // LIFETIME → MONTH YEAR
    return data.map(x =>
      new Date(x.label).toLocaleString('default', {
        month: 'short',
        year: 'numeric'
      })
    );
  }

  openLowStock() {
    this.router.navigate(['users/products'], {
      queryParams: { filter: 'low' }
    });
  }

  openExpiry() {
    this.router.navigate(['users/products'], {
      queryParams: { filter: 'expiry' }
    });
  }
}
