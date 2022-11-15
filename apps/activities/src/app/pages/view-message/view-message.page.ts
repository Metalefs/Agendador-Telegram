import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IActivity, UserModel } from '@uncool/shared';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  user!:UserModel;
  public activity!: IActivity;
  private _form!: UntypedFormGroup;
  public get form(): UntypedFormGroup {
    return this._form;
  }
  public set form(value: UntypedFormGroup) {
    this._form = value;
    this.fillForm();
  }

  constructor(
    private data: DataService,
    private authentication: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    await this.loadActivity();
    this.user = this.authentication.currentUserValue;
  }

  async loadActivity(){
    const loading = await this.loadingController.create();
    await loading.present();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.data.geActivityById(id).subscribe(async (activity) => {
        await loading.dismiss();

        this.activity = activity;
      });
    }
  }

  async update(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.data.update(this.form.value).subscribe(async ()=>{
      await loading.dismiss();
      this.loadActivity();
      const toast = await this.toastController.create({
        message: 'Activity updated',
        duration: 1500,
        position: 'top'
      });

      await toast.present();
    })
  }

  fillForm(){
    console.log(this.activity)
    this.form.patchValue(this.activity)
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }
}
