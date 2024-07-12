import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageKey = 'products';

  constructor() {}

  getProducts(): Product[] {
    const productsJson = localStorage.getItem(this.storageKey);
    return productsJson ? JSON.parse(productsJson) : [];
  }

  addProduct(product: Product): void {
    const products = this.getProducts();
    product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push(product);
    this.saveProducts(products);
  }

  updateProduct(updatedProduct: Product): void {
    let products = this.getProducts();
    products = products.map(product =>
      product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
    );
    this.saveProducts(products);
  }

  deleteProduct(productId: number): void {
    let products = this.getProducts();
    products = products.filter(product => product.id !== productId);
    this.saveProducts(products);
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
}
