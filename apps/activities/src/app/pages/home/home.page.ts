import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ModalController } from '@ionic/angular';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IconTypeEnum } from '@uncool/shared';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { Router } from '@angular/router';

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
    public service: DataService,
    private router: Router) {
      this.openModal = this.openModal.bind(this);
  }

  async ngOnInit(){
    this.activities = this.service.getActivities();
  }

  refresh(ev: any) {
    setTimeout(() => {
      ev.detail.complete();
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
    activityModal.present();
  }

  async logout() {
		await this.authService.logout();
		this.router.navigateByUrl('/', { replaceUrl: true });
	}

}
