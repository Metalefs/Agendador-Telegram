import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-cleaning-form',
  templateUrl: './cleaning-form.component.html',
  styleUrls: ['./cleaning-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class CleaningFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('audioFile', this.fb.control([this.activity.audioFile]))
  }

}
