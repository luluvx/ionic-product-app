import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonText,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonText,
    IonItem,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
],
})
export class LoginPage {
  showPwd = false;
  isLoading = false;
  username = '';
  password = '';
  messageError = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.isLoading = true;
    if (!this.username || !this.password) {
      this.messageError = 'Complete all fields';
      this.isLoading = false;
      return;
    }

    try {
      const success = await this.authService.login(
        this.username,
        this.password
      );
      if (success) {
        console.log('Login exitoso');
        this.router.navigate(['/product-list']);
      } else {
        this.messageError = 'Usuario o contraseña incorrectos';
      }
    } catch (error) {
      this.messageError = 'Error en el servidor';
      console.error('Error en login:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
