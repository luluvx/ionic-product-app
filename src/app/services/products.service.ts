import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private dbService: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    try {
      const query = `
        SELECT p.*, c.name as category_name, c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.createdAt DESC
      `;

      const products = await this.dbService.query(query);
      return products.map(this.mapToProduct);

    } catch (error) {
      console.error('Error', error);
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const query = `
        SELECT p.*, c.name as category_name, c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const products = await this.dbService.query(query, [id]);
      if (products.length > 0) {
        return this.mapToProduct(products[0]);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const query = `
        INSERT INTO products (name, description, category_id, image_url)
        VALUES (?, ?, ?, ?)
      `;
      const params = [
        product.name,
        product.description,
        product.category_id,
        product.image_url
      ];
      const result = await this.dbService.execute(query, params);
      return result > 0;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return false;
    }
  }

  async updateProduct(id: number, product: Product): Promise<boolean> {
    const query = `
      UPDATE products
      SET name = ?, description = ?, category_id = ?, image_url = ?
      WHERE id = ?
    `;
    const params = [
      product.name,
      product.description,
      Number(product.category_id),
      product.image_url,
      Number(id),
    ];
    const result = await this.dbService.execute(query, params);
    return result > 0;
}


  async deleteProduct(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM products WHERE id = ?';
      const result = await this.dbService.execute(query, [id]);
      return result > 0;

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const query = `
        SELECT p.*, c.name as category_name, c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR p.description LIKE ?
        ORDER BY p.createdAt DESC
      `;

      const searchPattern = `%${searchTerm}%`;
      const products = await this.dbService.query(query, [searchPattern, searchPattern]);
      return products.map(this.mapToProduct);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return [];
    }
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      const query = `
        SELECT p.*, c.name as category_name, c.icon as category_icon
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        ORDER BY p.createdAt DESC
      `;

      const products = await this.dbService.query(query, [categoryId]);
      return products.map(this.mapToProduct);

    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return [];
    }
  }

  private mapToProduct(dbProduct: any): Product {
    return {
      id: dbProduct.id.toString(),
      name: dbProduct.name,
      description: dbProduct.description || '',
      category_id: dbProduct.category_id,
      image_url: dbProduct.image_url || '',
      createdAt: dbProduct.createdAt || Date.now(),
      updatedAt: dbProduct.updatedAt || Date.now()
    };
  }
}
