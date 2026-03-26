import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { PlantRepository } from './app/features/plants/infrastructure/repositories/plant.repository';
import { LocalStoragePlantRepository } from './app/features/plants/infrastructure/repositories/local-storage-plant.repository';
import { BookRepository } from './app/features/books/infrastructure/repositories/book.repository';
import { LocalStorageBookRepository } from './app/features/books/infrastructure/repositories/local-storage-book.repository';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: PlantRepository, useClass: LocalStoragePlantRepository },
    { provide: BookRepository, useClass: LocalStorageBookRepository },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
