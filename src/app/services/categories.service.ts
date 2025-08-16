import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private databaseService: DatabaseService) {
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const query = 'SELECT * FROM categories ORDER BY name';
      const categories = await this.databaseService.query(query);
      return categories.map(this.mapToCategory);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const query = 'SELECT * FROM categories WHERE id = ?';
      const categories = await this.databaseService.query(query, [id]);
      if (categories.length > 0) {
        return this.mapToCategory(categories[0]);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener categoría por ID:', error);
      return null;
    }
  }
  private mapToCategory(dbCategory: any): Category {
    return {
      id: dbCategory.id,
      name: dbCategory.name,
      icon: dbCategory.icon,
      createdAt: dbCategory.createdAt || Date.now(),
      updatedAt: dbCategory.updatedAt || Date.now()
    };
  }
}
