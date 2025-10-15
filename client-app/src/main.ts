import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/startup/app.component';
import { appConfig } from './app/startup/app.config';

bootstrapApplication(AppComponent, appConfig)
.catch(err => console.error(err));
