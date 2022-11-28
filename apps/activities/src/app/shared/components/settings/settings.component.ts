import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { IUserSettings } from '@uncool/shared';
import { SettingsService } from './settings.service';

@Component({
  selector: 'uncool-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  form!: UntypedFormGroup;
  settings?: IUserSettings;
  constructor(private service: SettingsService,
    private fb: UntypedFormBuilder,
    private loadingController: LoadingController,
    private modalCtrl: ModalController) { }

  async ngOnInit() {
    await this.loadSettings();
    this.form = this.fb.group({
      _id: [, []],
      telegramChatId: [this.settings?.telegramChatId??'', [Validators.required]],
    });
  }

  async loadSettings(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.service.findUserSettings().subscribe(async (settings) => {
      this.settings = settings[0];
      this.form.patchValue(this.settings);
      await loading.dismiss();
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }
}
