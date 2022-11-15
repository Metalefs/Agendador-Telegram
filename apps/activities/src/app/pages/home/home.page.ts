import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IconTypeEnum } from '@uncool/shared';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  result!: string;
  iconTypes = IconTypeEnum;
  activities!:IActivity[];
  constructor(
    public modalCtrl: ModalController,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public service: DataService,
    private router: Router) {
      this.openModal = this.openModal.bind(this);
      this.createActivity = this.createActivity.bind(this);
  }

  async ngOnInit(){
   this.getActivities()
  }

  getActivities(){
    this.service.getActivities().subscribe(activities => {
      this.activities = activities;
    });
  }

  refresh(ev: any) {
    setTimeout(() => {
      ev.detail.complete();
      this.getActivities()
    }, 3000);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  async openModal() {
    const activityModal = await this.modalCtrl.create({
      component: EditActivityComponent,
      componentProps: { userId: 8675309 }
    });
    activityModal.onDidDismiss().then(this.createActivity)
    activityModal.present();
  }

  async createActivity(activity: OverlayEventDetail){
    this.service.create(activity.data).subscribe(()=> {
      this.getActivities()
    });
  }

  async delete(activity:IActivity){
    const loading = await this.loadingController.create();
    await loading.present();

    this.service.delete(activity._id!).subscribe(async ()=>{
      await loading.dismiss();
      this.getActivities();
      const toast = await this.toastController.create({
        message: 'Activity deleted',
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
