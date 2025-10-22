import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { defineCustomElements } from '@ionic/pwa-elements/loader';


bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

defineCustomElements(window);