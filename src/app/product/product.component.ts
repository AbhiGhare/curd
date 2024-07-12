// src/app/product/product.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  searchTerm: string = '';
  searchTermDetails: string = '';
  searchTermPrice: string = '';
  dateRange: { start: Date | null, end: Date | null } = { start: null, end: null };
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  sortColumn: string = 'name';
  
  newProduct: Product = {
    id: 0,
    name: '',
    detail: '',
    picture: '',
    price: 0,
    quantity: 0,
    totalPrice: 0,
    createdDate: new Date(),
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.updateDisplayedProducts();
  }

  filterProducts(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim(); 
    let filteredProducts: Product[] = [];
  
    if (searchTerm) {
      filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) 
        // product.detail.toLowerCase().includes(searchTerm) ||
        // product.price.toString().includes(searchTerm)
      );
    } else {
      filteredProducts = [...this.products];
    }
  
    this.updateDisplayedProducts(filteredProducts);
  }
  filterProductsPrice(): void {
    const searchTerm = this.searchTermPrice.toLowerCase().trim(); 
    let filteredProducts: Product[] = [];
  
    if (searchTerm) {
      filteredProducts = this.products.filter(product =>
        // product.name.toLowerCase().includes(searchTerm) ||
        // product.detail.toLowerCase().includes(searchTerm) ||
        product.price.toString().includes(searchTerm)
      );
    } else {
      filteredProducts = [...this.products];
    }
  
    this.updateDisplayedProducts(filteredProducts);
  }
  filterProductsDetails(): void {
    const searchTerm = this.searchTermDetails.toLowerCase().trim(); 
    let filteredProducts: Product[] = [];
  
    if (searchTerm) {
      filteredProducts = this.products.filter(product =>
        // product.name.toLowerCase().includes(searchTerm) ||
        product.detail.toLowerCase().includes(searchTerm) 
        // product.price.toString().includes(searchTerm)
      );
    } else {
      filteredProducts = [...this.products];
    }
  
    this.updateDisplayedProducts(filteredProducts);
  }

  filterByDateRange(): void {
    const filtered = this.products.filter(product => {
      const createdDate = new Date(product.createdDate);
      return (!this.dateRange.start || createdDate >= this.dateRange.start) &&
             (!this.dateRange.end || createdDate <= this.dateRange.end);
    });
    this.updateDisplayedProducts(filtered);
  }

  sort<TKey extends keyof Product>(key: TKey): void {
    this.products.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return valueA.getTime() - valueB.getTime();
      } else {
        return 0;
      }
    });
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(filteredProducts?: Product[]): void {
    const productsToDisplay = filteredProducts || this.products;
    this.displayedProducts = productsToDisplay.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  enableEdit(product: Product): void {
    product.editMode = true;
  }

  saveEdit(product: Product): void {
    product.editMode = false;
    product.totalPrice = product.price * product.quantity;
    this.productService.updateProduct(product);
    this.loadProducts();
  }

  deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        this.productService.deleteProduct(productId);
        this.loadProducts();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'info');
      }
    })
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  addNewProduct(): void {
    this.showform=false
    this.newProduct.totalPrice = this.newProduct.price * this.newProduct.quantity;
    // this.newProduct.createdDate = new Date();
    this.productService.addProduct(this.newProduct);
    this.newProduct = {
      id: 0,
      name: '',
      detail: '',
      picture: '',
      price: 0,
      quantity: 0,
      totalPrice: 0,
      createdDate: this.newProduct.createdDate,
    };
    this.loadProducts();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
  }

  updateDate(product: Product, newDate: string): void {
    product.createdDate = new Date(newDate);
    this.productService.updateProduct(product);
    this.loadProducts();
  }
  showform:boolean=false
  show(){
    this.showform=true
  }
}
