import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../product.service';
import { AddProductsComponent } from '../add-products/add-products.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchText = '';
  filterType: 'low' | 'expiry' | null = null;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 🔹 Read filter from URL
    this.route.queryParams.subscribe(params => {
      this.filterType = params['filter'] || null;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = (res.products || []).map((p: any) => ({
          ...p,
          unit: p.unit || p.unit_type || 'PCS'
        }));

        this.applyFilter();
      },
      error: () => {
        alert('Failed to load products');
      }
    });
  }

  /* ===============================
     FILTER LOGIC
  ================================ */
  applyFilter() {
    let list = [...this.products];

    if (this.filterType === 'low') {
      list = list.filter(p => p.quantity < 10);
    }

    if (this.filterType === 'expiry') {
      const today = new Date();
      const next30 = new Date();
      next30.setDate(today.getDate() + 30);

      list = list.filter(p =>
        p.expiry_date &&
        new Date(p.expiry_date) <= next30
      );
    }

    this.filteredProducts = list;
  }

  /* ===============================
     SEARCH
  ================================ */
  onSearch() {
    const value = this.searchText.toLowerCase().trim();

    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(value) ||
      p.unit.toLowerCase().includes(value)
    );
  }

  /* ===============================
     ACTIONS
  ================================ */
  addProduct() {
    const dialogRef = this.dialog.open(AddProductsComponent, {
      width: '420px'
    });

    dialogRef.afterClosed().subscribe(() => this.loadProducts());
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(AddProductsComponent, {
      width: '420px',
      data: product
    });

    dialogRef.afterClosed().subscribe(() => this.loadProducts());
  }

  deleteProduct(id: number) {
    if (!confirm('Delete product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: () => alert('Delete failed')
    });
  }
}
