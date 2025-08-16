import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | null = null;

  constructor(private databaseService: DatabaseService) {}

  async login(username: string, password: string): Promise<boolean> {
    try {
      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      const users = await this.databaseService.query(query, [username, password]);

      if (users.length > 0) {
        this.currentUser = this.mapToUser(users[0]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }
  private mapToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      email: dbUser.email,
      username: dbUser.username,
      password: dbUser.password,
      createdAt: dbUser.createdAt || Date.now(),
      updatedAt: dbUser.updatedAt || Date.now()
    };
  }
}
