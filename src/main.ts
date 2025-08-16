import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  add,
  createOutline,
  trashOutline,
  albumsOutline,
  imageOutline,
  closeCircleOutline,
  documentTextOutline,
  pricetagOutline,

} from 'ionicons/icons';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

addIcons({
  'person-outline': personOutline,
  'lock-closed-outline': lockClosedOutline,
  'add': add,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'albums-outline': albumsOutline,
  'image-outline': imageOutline,
  'close-circle-outline': closeCircleOutline,
  'document-text-outline': documentTextOutline,
  'pricetag-outline': pricetagOutline,
});
