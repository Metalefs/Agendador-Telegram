import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-sleep-form',
  templateUrl: './sleep-form.component.html',
  styleUrls: ['./sleep-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SleepFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('hours', this.fb.control([this.activity?.hours]))
    this.form.addControl('audioFile', this.fb.control([this.activity?.audioFile]))

    console.log(this.activity)
  }
}
