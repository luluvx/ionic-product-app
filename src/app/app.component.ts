import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      await this.dbService.initDB();
      console.log('Db iniciada');
    } catch (error) {
      console.error('Error inicializando la db:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
