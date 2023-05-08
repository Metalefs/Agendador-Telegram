import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ChronogramType, IChronogram } from '@uncool/shared';

@Component({
  selector: 'app-edit-chronogram',
  templateUrl: './edit-chronogram.component.html',
  styleUrls: ['./edit-chronogram.component.scss'],
})
export class EditChronogramComponent implements OnInit {
  form!: UntypedFormGroup;
  type = ChronogramType;
  constructor(
    private fb: UntypedFormBuilder,
    private params: NavParams,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    const chronogram:IChronogram = (this.params.data as any).extra.chronogram;

    this.form = this.fb.group({
      _id: [chronogram?._id ?? null, []],
      title: [chronogram?.title ?? '', [Validators.required]],
      type: [chronogram, Validators.required],
      enabled: [chronogram?.enabled ?? false]
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }
}
