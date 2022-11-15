import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html'
})
export class EditActivityFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Output() onInitForm = new EventEmitter<UntypedFormGroup>()
  constructor(private service: DataService, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      _id: [, []],
      title: [, [Validators.required]],
      date: [, [Validators.required]],
      time: [, [Validators.required]],
      recurrence: [, Validators.required],
      weekdays: [, Validators.required],
      description: [,],
      type: [, Validators.required]
    });
    this.onInitForm.emit(this.form);
  }

  getActivityTypes(){
    return this.service.activityTypesMap;
  }
}
