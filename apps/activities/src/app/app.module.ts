require("dotenv").config();

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
import { SwPush, SwUpdate } from '@angular/service-worker';

import { LanguageService } from './shared/services/language-service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { JwtInterceptor, ErrorInterceptor } from './core/interceptor';
import { DataService } from './shared/services/data.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LocalNotificationService } from './shared/services/localNotification.service';

const httpLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }), AppRoutingModule],
  providers: [LanguageService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, LocalNotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DataService, ToastrService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private pushSw: SwPush, private update: SwUpdate) {
    update.versionUpdates.subscribe((update: any) => {
      console.log("Nova versão disponível");
    });

    this.SubscribeToPush();
    pushSw.messages.subscribe((msg: any) => {
      console.log(JSON.stringify(msg));
    })
  }
  SubscribeToPush() {
    this.pushSw.requestSubscription({
      serverPublicKey: process.env['VAPID_PUBLIC_KEY'] || 'BL7zaaFxN-cDod1-QDTB7soAyQafNMqTqr4eI-SDWBIhA4NqYqEhjHb451RkxJEP2_Fv8SEcij9OBHfhDsH8FEk'
    })
      .then((pushSubscription: any) => {
        console.log(JSON.stringify(pushSubscription));
      })

      .catch((err: string) => {
        console.error("Ocorreu um erro:" + err);
      })
  }
}

