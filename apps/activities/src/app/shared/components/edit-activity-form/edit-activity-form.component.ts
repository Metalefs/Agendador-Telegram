import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivityTypeEnum } from '@uncool/shared';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html'
})
export class EditActivityFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() type!: string;
  @Output() onInitForm = new EventEmitter<UntypedFormGroup>();
  activityType = ActivityTypeEnum;
  constructor(private service: DataService, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      _id: [, []],
      title: [, [Validators.required]],
      time: [new Date().toISOString(), [Validators.required]],
      weekdays: [, Validators.required],
      description: [,],
      type: [this.type, Validators.required]
    });
    this.onInitForm.emit(this.form);
  }

  getActivityTypes(){
    return this.service.activityTypesMap;
  }

  get time() {
		return this.form.get('time');
	}

  get curType() {
    return this.form.get('type')?.value || this.type
  }
}
