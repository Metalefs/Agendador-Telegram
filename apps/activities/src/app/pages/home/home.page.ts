import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../../shared/services/activities.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IChronogram, IconTypeEnum, IUserSettings } from '@uncool/shared';
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
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { ChronogramsService } from '../../shared/services/chronograms.service';
import { EditChronogramComponent } from '../../shared/components/edit-chronogram/edit-chronogram.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  result!: string;
  iconTypes = IconTypeEnum;
  chronograms!: IChronogram[];
  activities!: IActivity[];
  weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  activeChronogram: IChronogram | null = null;
  activeWeekdays: string[] = this.weekdays;//[this.weekdays[new Date().getDay()]]
  userSettings?: IUserSettings;
  events: EventInput[] = [];

  constructor(
    public modalCtrl: ModalController,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public service: ActivitiesService,
    public chronogramService: ChronogramsService,
    public settingsService: SettingsService,
    private router: Router,
    private translate: TranslateService,
    private localNotificationService: LocalNotificationService,
    private pushNotificationService: PushNofiticationService,
    private webNotificationService: WebNotificationService,
    public connectivityService: ConnectivityService) {
    this.openAddActivityModal = this.openAddActivityModal.bind(this);
    this.createActivity = this.createActivity.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.getActivities.bind(this);
  }

  async ionViewWillEnter(){
    await this.ngOnInit();
 }

  async ngOnInit() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

    if (isPushNotificationsAvailable) {
      this.pushNotificationService.initPushNotifications()
    }
    else {
      this.webNotificationService.subscribeToNotification()
    }

    this.settingsService.findUserSettings().subscribe(settings => {
      this.userSettings = settings[0]
    });
    this.getChronograms();
    this.getActivities();
  }

  getActivities() {
    this.filterWeekdays(this.activeWeekdays)
  }
  getChronograms() {
    this.chronogramService.getChronograms().subscribe(chronograms => {
      this.chronograms = chronograms;
      console.log(this.chronograms)
    })
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

  async openAddActivityModal(type: string, extra?:any) {
    const activityModal = await this.modalCtrl.create({
      component: EditActivityComponent,
      componentProps: { type, extra }
    });
    activityModal.onDidDismiss().then(this.createActivity)
    activityModal.present();
  }

  async openAddChronogramModal() {
    const modal = await this.modalCtrl.create({
      component: EditChronogramComponent,
      componentProps: { }
    });
    modal.onDidDismiss().then(this.createChronogram.bind(this))
    modal.present();
  }

  async openAddSettingsModal() {
    const activityModal = await this.modalCtrl.create({
      component: SettingsComponent,
      componentProps: {}
    });
    activityModal.onDidDismiss().then(this.updateSettings)
    activityModal.present();
  }

  async updateSettings(settings: OverlayEventDetail) {
    if (settings.role !== 'confirm') return;
    const loading = await this.loadingController.create();
    await loading.present();

    if (settings.data._id)
      this.settingsService.update(settings.data).subscribe(async () => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: await this.translate.get('settings.edited').toPromise(),
          duration: 1500,
          position: 'top'
        });

        await toast.present();
      })
    else
      this.settingsService.create(settings.data).subscribe(async () => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: await this.translate.get('settings.edited').toPromise(),
          duration: 1500,
          position: 'top'
        });

        await toast.present();
      })
    this.getActivities();
  }

  async createActivity(activity: OverlayEventDetail) {
    if (activity.role === 'confirm') {
      const createOBJ = activity.data;
      if(typeof(createOBJ.weekdays) === 'string'){
        createOBJ.weekdays = [createOBJ.weekdays];
      }
      this.service.create(createOBJ).subscribe(async () => {
        this.getActivities();
        const toast = await this.toastController.create({
          message: await this.translate.get('activities.created').toPromise(),
          duration: 1500,
          position: 'top'
        });
        await toast.present()
      });
    }
  }

  async createChronogram(activity: OverlayEventDetail) {
    if (activity.role === 'confirm') {
      const createOBJ = activity.data;
      this.chronogramService.create(createOBJ).subscribe(async () => {
        this.getChronograms();
        this.getActivities();
        const toast = await this.toastController.create({
          message: await this.translate.get('chronograms.created').toPromise(),
          duration: 1500,
          position: 'top'
        });
        await toast.present()
      });
    }
  }

  async editChronogram(chronogram: IChronogram) {
    const modal = await this.modalCtrl.create({
      component: EditChronogramComponent,
      componentProps: { chronogram }
    });
    modal.onDidDismiss().then(((activity: OverlayEventDetail) => {
      if (activity.role === 'confirm') {
        const createOBJ = activity.data;
        this.chronogramService.update(createOBJ).subscribe(async () => {
          this.getChronograms();
          this.getActivities();
          const toast = await this.toastController.create({
            message: await this.translate.get('chronograms.updated').toPromise(),
            duration: 1500,
            position: 'top'
          });
          await toast.present()
        });
      }
    }))

    modal.present();
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

  async deleteChronogram(chronogram:IChronogram){
    const confirmation = await confirm(await this.translate.get('general.delete').toPromise() + " " +chronogram.title +" ?")
    if(!confirmation) return;

    const loading = await this.loadingController.create();
    await loading.present();

    this.chronogramService.delete(chronogram._id!).subscribe(async () => {
      await loading.dismiss();
      this.getChronograms();
      this.getActivities();
      const toast = await this.toastController.create({
        message: await this.translate.get('chronograms.deleted').toPromise(),
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

  toggleChronogram(chronogram: IChronogram) {
    if (!this.isChronogramSelected(chronogram)){
      this.activeChronogram = chronogram
      this.filterChronogram()
    }
    else {
      this.activeChronogram = null
      this.filterWeekdays(this.activeWeekdays)
    }
  }

  isChronogramSelected(chronogram: IChronogram|null) {
    return this.activeChronogram === chronogram;
  }

  filterChronogram() {
    if(this.activeChronogram!._id!)
    this.service.getActivitiesByChronogramId(this.activeChronogram!._id!).subscribe(async (activities: IActivity[]) => {
      this.activities = activities;

      this.events = this.service.activityToCalendarEvent(this.activities);
      console.log(activities,this.events)
      this.connectivityService.offlineEvent?.subscribe(async e => {
        await this.localNotificationService.cancelPending();
        await this.localNotificationService.schedule(this.activities);
      })
    });
  }

  filterWeekdays(days: string[]) {
    if(this.activeChronogram?._id){
      this.filterChronogram();
      return;
    }

    if (!days || days.length === 0) days = this.weekdays;
    this.service.getActivitiesByWeekdays(days).subscribe(async (activities: IActivity[]) => {
      this.activities = activities;

      this.events = this.service.activityToCalendarEvent(this.activities);

      this.connectivityService.offlineEvent?.subscribe(async e => {
        await this.localNotificationService.cancelPending();
        await this.localNotificationService.schedule(this.activities);
      })
    });
  }

  async handleDateClick(event:DateSelectArg){
    await this.openAddActivityModal('other', {
      time: event.start,
      chronogramId: this.activeChronogram?._id ?? null
    })
  }

  handleEventlick(event:EventClickArg){
    const id = (event.event._def.extendedProps as any).data._id;
    this.router.navigate(['/activity/' + id])
  }
}
