import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IActivity } from '@uncool/shared';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.data.geActivityById(id).subscribe(activity => {
        this.activity = activity;
      });
    }
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
