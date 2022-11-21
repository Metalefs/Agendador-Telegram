import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { LanguageService } from './shared/services/language-service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { JwtInterceptor, ErrorInterceptor } from './core/interceptor';
import { DataService } from './shared/services/data.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LocalNotificationService } from './shared/services/localNotification.service';
import { environment } from '../environments/environment';
import { CheckForUpdateService } from './shared/services/checkForUpdatesService';
import { WebNotificationService } from './shared/services/webNotificationService';
import { PushNofiticationService } from './shared/services/pushNotificationService';

const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyBrIZEqzfFDbjPThP_LfQGGjJ680nMef9M",
        authDomain: "mealprepscheduler.firebaseapp.com",
        projectId: "mealprepscheduler",
        storageBucket: "mealprepscheduler.appspot.com",
        messagingSenderId: "911796857770",
        appId: "1:911796857770:web:865f5c4f0571d5605119d3",
        measurementId: "G-2HDM3Y267V"
      }
    ),
    AngularFireMessagingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [LanguageService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WebNotificationService,
    LocalNotificationService,
    PushNofiticationService,
    CheckForUpdateService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DataService, ToastrService],
  bootstrap: [AppComponent],
})
export class AppModule {

}

