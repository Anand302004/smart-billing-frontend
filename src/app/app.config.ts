import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),                       // 👈 Material animations
    importProvidersFrom(MaterialModule),      // 👈 Material components
    provideHttpClient(withInterceptors([authInterceptor])),
     importProvidersFrom(MatNativeDateModule),
     provideCharts(withDefaultRegisterables())
     
  ]
};
