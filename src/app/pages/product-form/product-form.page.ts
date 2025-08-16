import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonSelectOption,
  IonSelect,
  IonImg,
  IonIcon,
  IonNote,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { IonInput } from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle,
    IonCardHeader,
    IonNote,
    IonIcon,
    IonImg,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class ProductFormPage implements OnInit {
  productForm!: FormGroup;
  currentProductId: number | null = null;
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: [''],
      description: [''],
      category_id: [null],
      image_url: [''],
    });
    await this.loadCategories();
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.currentProductId = parseInt(id, 10);
        await this.loadProduct(this.currentProductId);
      }
    });
  }
  async loadProduct(id: number) {
    try {
      const product = await this.productsService.getProductById(id);
      if (product) {
        this.productForm.patchValue(product);
      }
    } catch (error) {
      console.error('error loading product', error);
    }
  }

  async loadCategories() {
    try {
      this.categories = await this.categoriesService.getAllCategories();
    } catch (error) {
      console.error('error loading categories', error);
    }
  }
  async onSubmit() {
    if (this.productForm.valid) {
      this.isLoading = true;
      const product: Product = this.productForm.value;
      if (this.currentProductId) {
        await this.productsService.updateProduct(
          this.currentProductId,
          product
        );
        this.router.navigate(['/product-list']);
        return;
      } else {
        await this.productsService.addProduct(product);
        this.router.navigate(['/product-list']);
        return;
      }
    }
  }
  async selectAnImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });
    this.productForm.patchValue({ image_url: image.dataUrl });
  }

  cancel() {
    this.router.navigate(['/product-list']);
  }
}
