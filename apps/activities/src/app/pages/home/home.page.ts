import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IconTypeEnum } from '@uncool/shared';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { LocalNotificationService } from '../../shared/services/localNotification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  result!: string;
  iconTypes = IconTypeEnum;
  activities!: IActivity[];
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public service: DataService,
    private router: Router,
    private translate: TranslateService,
    private notificationService: LocalNotificationService) {
    this.openAddActivityModal = this.openAddActivityModal.bind(this);
    this.createActivity = this.createActivity.bind(this);
  }

  async ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    // PushNotifications.requestPermissions().then((result: { receive: string; }) => {
    //   if (result.receive === 'granted') {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     PushNotifications.register();
    //   } else {
    //     // Show some error
    //   }
    // });

    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
      },
    );

    this.getActivities();
    await this.notificationService.scheduleTest();
  }

  getActivities() {
    this.service.getActivities().subscribe(async activities => {
      this.activities = activities;

      await this.notificationService.schedule(this.activities);
    });
  }

  refresh(ev: any) {
    setTimeout(() => {
      ev.detail.complete();
      this.getActivities()
    }, 3000);
  }

  async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(this.activities);
    this.setPriority(this.activities);
  }

  async setPriority(activities: IActivity[]) {
    let idx = 0;
    for (let activity of activities) {
      if (activity.priority != idx) {
        activity.priority = idx;
        this.service.update(activity).subscribe();
      }
      idx++;
    }
  }

  async openAddActivityModal(type: string) {
    const activityModal = await this.modalCtrl.create({
      component: EditActivityComponent,
      componentProps: { type }
    });
    activityModal.onDidDismiss().then(this.createActivity)
    activityModal.present();
  }

  async createActivity(activity: OverlayEventDetail) {
    if (activity.role === 'confirm')
      this.service.create(activity.data).subscribe(async () => {
        this.getActivities();
        const toast = await this.toastController.create({
          message: await this.translate.get('activity.created').toPromise(),
          duration: 1500,
          position: 'top'
        });
        await toast.present()
      });
  }

  async delete(activity: IActivity) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.service.delete(activity._id!).subscribe(async () => {
      await loading.dismiss();
      this.getActivities();
      const toast = await this.toastController.create({
        message: await this.translate.get('activity.deleted').toPromise(),
        duration: 1500,
        position: 'top'
      });

      await toast.present();
    })
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

}
