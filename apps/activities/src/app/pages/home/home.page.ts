import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EditActivityComponent } from '../../shared/components/edit-activity/edit-activity.component';
import { IActivity, IconTypeEnum } from '@uncool/shared';
import { ItemReorderEventDetail } from '@ionic/angular';

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
    private actionSheetCtrl: ActionSheetController,
    public service: DataService,
    private translate: TranslateService) {
      this.openModal = this.openModal.bind(this);
  }

  ngOnInit(){
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('activities.add'),
      subHeader: this.translate.instant('activities.choose'),
      buttons: [
        {
          text: await this.translate.get('activities.shopping').toPromise(),
          handler: async () => await this.openModal()
        },
        {
          text: await this.translate.get('activities.prep').toPromise(),
          handler: async () => await this.openModal()
        },
        {
          text: await this.translate.get('activities.meal').toPromise(),
          handler: async () => await this.openModal()
        },
        {
          text: await this.translate.get('activities.cleaning').toPromise(),
          handler: async () => await this.openModal()
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    this.result = JSON.stringify(result, null, 2);
  }

  async openModal() {
    const activityModal = await this.modalCtrl.create({
      component: EditActivityComponent,
      componentProps: { userId: 8675309 }
    });
    activityModal.present();
  }

}
