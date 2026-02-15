import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { HttpServicesService } from '../../http-services.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  stats: any = {};
  recentUsers: any[] = [];
  chart: any;
  chartData: any;
  system: any = {};

  constructor(private api: HttpServicesService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    // chart DOM ready after view init
    if (this.chartData) {
      this.createChart(this.chartData);
    }
  }

  // ================= LOAD DATA =================
  loadDashboard() {

    this.api.getStats().subscribe({
      next: (res: any) => {

        this.system = res.system || {};

        this.stats = res;
        this.recentUsers = res.recentUsers || [];

        // prepare chart data
        this.chartData = {
          labels: res.monthly?.map((m:any) => `Month ${m.month}`),
          values: res.monthly?.map((m:any) => m.total)
        };

        // recreate safely
        setTimeout(() => {
          this.createChart(this.chartData);
        }, 100);
      },
      error: (err) => {
        console.error("Dashboard Error:", err);
      }
    });
  }

  // ================= CREATE CHART =================
  createChart(data: any) {

    const canvas: any = document.getElementById('dashboardChart');
    if (!canvas) return;

    // 🔥 destroy old chart (MAIN FIX)
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels || [],
        datasets: [{
          label: 'Subscriptions',
          data: data.values || []
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        resizeDelay: 200,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
