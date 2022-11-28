import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../../shared/services/activities.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IconTypeEnum } from '@uncool/shared';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { Capacitor } from '@capacitor/core';

import { LocalNotificationService } from '../../shared/services/localNotification.service';
import { TranslateService } from '@ngx-translate/core';
import { WebNotificationService } from '../../shared/services/webNotificationService';
import { PushNofiticationService } from '../../shared/services/pushNotificationService';
import { ConnectivityService } from '../../shared/services/connectivity.service';
import { SettingsComponent } from '../../shared/components/settings/settings.component';
import { SettingsService } from '../../shared/components/settings/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  result!: string;
  iconTypes = IconTypeEnum;
  activities!: IActivity[];
  activeWeekdays: string[] = []

  weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

  constructor(
    public modalCtrl: ModalController,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public service: ActivitiesService,
    public settingsService: SettingsService,
    private router: Router,
    private translate: TranslateService,
    private localNotificationService: LocalNotificationService,
    private pushNotificationService: PushNofiticationService,
    private webNotificationService: WebNotificationService,
    private connectivityService: ConnectivityService) {
      this.openAddActivityModal = this.openAddActivityModal.bind(this);
      this.createActivity = this.createActivity.bind(this);
      this.updateSettings = this.updateSettings.bind(this);
      this.getActivities.bind(this);
  }

  async ngOnInit() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

    if (isPushNotificationsAvailable) {
      this.pushNotificationService.initPushNotifications()
    }
    else {
      this.webNotificationService.subscribeToNotification()
    }

    this.getActivities();
  }

  getActivities() {
    this.service.getActivities().subscribe(async activities => {
      this.activities = activities;

      this.connectivityService.offlineEvent?.subscribe(async e=>{
        await this.localNotificationService.cancelPending();
        await this.localNotificationService.schedule(this.activities);
      })
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

  async openAddSettingsModal() {
    const activityModal = await this.modalCtrl.create({
      component: SettingsComponent,
      componentProps: {  }
    });
    activityModal.onDidDismiss().then(this.updateSettings)
    activityModal.present();
  }

  async updateSettings(settings: OverlayEventDetail){
    if (settings.role !== 'confirm') return;
    const loading = await this.loadingController.create();
    await loading.present();

    if(settings.data._id)
      this.settingsService.update(settings.data).subscribe(async ()=>{
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: await this.translate.get('settings.edited').toPromise(),
          duration: 1500,
          position: 'top'
        });

        await toast.present();
      })
    else
    this.settingsService.create(settings.data).subscribe(async ()=>{
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: await this.translate.get('settings.edited').toPromise(),
        duration: 1500,
        position: 'top'
      });

      await toast.present();
    })
  }

  async createActivity(activity: OverlayEventDetail) {
    if (activity.role === 'confirm')
      this.service.create(activity.data).subscribe(async () => {
        this.getActivities();
        const toast = await this.toastController.create({
          message: await this.translate.get('activities.created').toPromise(),
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
        message: await this.translate.get('activities.deleted').toPromise(),
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

  toggleWeekday(day:string){
    if(!this.isDaySelected(day))
      this.activeWeekdays.push(day)
    else
      this.activeWeekdays.splice(this.activeWeekdays.indexOf(day),1)
    this.filterWeekdays(this.activeWeekdays)
  }

  filterWeekdays(days:string[]){
    if(!days || days.length === 0) days = this.weekdays;
    this.service.getActivitiesByWeekdays(days).subscribe(async (activities:IActivity[]) => {
      this.activities = activities;

      this.connectivityService.offlineEvent?.subscribe(async e=>{
        await this.localNotificationService.cancelPending();
        await this.localNotificationService.schedule(this.activities);
      })
    });
  }

  isDaySelected(day:string){
    return this.activeWeekdays.includes(day);
  }

}
