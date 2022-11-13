import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IonModal, ModalController, NavParams } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss'],
})
export class EditActivityComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  form!: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    params: NavParams,
    private modalCtrl: ModalController,
    private service: DataService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: [, [Validators.required]],
      date: [, [Validators.required]],
      time: [, [Validators.required]],
      recurrence: [, Validators.required],
      weekdays: [, Validators.required],
      description: [,],
      type: [, Validators.required]
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }
}
