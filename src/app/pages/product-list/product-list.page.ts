import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonButton,
  IonThumbnail,
  IonAvatar,
  IonImg,
  IonCard,
  IonButtons,
} from '@ionic/angular/standalone';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonCard,
    IonImg,
    IonAvatar,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    IonList,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonThumbnail,
    IonItem
],
})
export class ProductListPage implements OnInit {
  products: Product[] = [];
  isLoading = false;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProducts();
  }
  async ionViewWillEnter() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      this.products = await this.productsService.getAllProducts();
      console.log('Products:', this.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async createProduct() {
    this.router.navigate(['/product-form']);
  }
  async editProduct(productId: number) {
    this.router.navigate(['/product-form', productId]);
  }
  async deleteProduct(productId: number): Promise<void> {
    await this.productsService.deleteProduct(productId);
    await this.loadProducts();
  }
}
