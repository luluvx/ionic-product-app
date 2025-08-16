import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Product } from '../models/product';

const DB_PRODUCTS = 'myproductsdb';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);

  }

  async initDB() {
    try {
      this.db = await this.sqlite.createConnection(
        DB_PRODUCTS,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();
      await this.createTables();
      return this.db;
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
      throw error;
    }
  }

  private async createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );
    `;
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );
    `;
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category_id INTEGER NOT NULL,
        image_url TEXT,
        createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `;
    await this.db.run(createUsersTable);
    await this.db.run(createCategoriesTable);
    await this.db.run(createProductsTable);

    console.log('tables created');

    await this.insertSampleData();
  }

  private async insertSampleData() {
    const existingCategories = await this.query('SELECT * FROM categories');
    if (existingCategories.length === 0) {
      const categories = [
        { name: 'Electronics', icon: 'phone' },
        { name: 'Clothing', icon: 'shirt' },
        { name: 'Books', icon: 'book' },
      ];
      for (const category of categories) {
        await this.db.run(
          'INSERT INTO categories (name, icon) VALUES (?, ?)',

          [category.name, category.icon]
        );
      }
    } else {
      console.log('categories already exist, not inserting data.');
    }

    const existingUser = await this.query(
      'SELECT * FROM users WHERE username = ?',
      ['mateo_rivera']
    );
    if (existingUser.length === 0) {
      const user = {
        first_name: 'Mateo',
        last_name: 'Rivera',
        email: 'mateo.rivera@example.com',
        username: 'mateo_rivera',
        password: 'password123*',
      };
      await this.db.run(
        'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
        [
          user.first_name,
          user.last_name,
          user.email,
          user.username,
          user.password,
        ]
      );
      console.log('User inserted');
    } else {
      console.log('User already exists, not inserting');
    }
  }
  async query(query: string, params: any[] = []): Promise<any[]> {
    try {
      if (!this.db) {
        throw new Error('Base de datos no inicializada');
      }
      const result = await this.db.query(query, params);
      return result.values ? result.values : [];
    } catch (error) {
      console.error('Error en la consulta', error);
      throw error;
    }
  }

  async execute(query: string, params: any[] = []): Promise<number> {
    try {
      if (!this.db) {
        throw new Error('Base de datos no inicializada');
      }
      const result = await this.db.run(query, params);
      return result.changes?.changes || 0;
    } catch (error) {
      console.error('Error en la ejecución', error);
      throw error;
    }
  }

  async closeDB() {
    try {
      if (this.db) {
        await this.db.close();
        console.log('Base de datos cerrada');
      }
    } catch (error) {
      console.error('Error al cerrar la base de datos', error);
      throw error;
    }
  }


}
