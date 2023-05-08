import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss'],
})
export class EditActivityComponent implements OnInit {
  form!: UntypedFormGroup;
  type?: string;
  chronogramId?: string;
  time?: Date;
  constructor(
    private params: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.type = (this.params.data as any).type;
    this.chronogramId = (this.params.data as any).extra.chronogramId;
    this.time = (this.params.data as any).extra.time;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }
}
