import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { IExercise } from '@uncool/shared';
import { AddExerciseComponent } from './components/add-exercise/add-exercise.component';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css'],
})
export class WorkoutFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;

  constructor(private fb: UntypedFormBuilder,
    public modalCtrl: ModalController) {
      this.openAddExerciseModal = this.openAddExerciseModal.bind(this)
      this.addExercise = this.addExercise.bind(this)
    }

  ngOnInit() {
    this.form.addControl('group', this.fb.control(this.activity.group ?? undefined))
    this.form.addControl('exercises', this.fb.control(this.activity.exercises ?? undefined))
  }

  async openAddExerciseModal(){
    const exerciseModal = await this.modalCtrl.create({
      component: AddExerciseComponent
    });
    exerciseModal.onDidDismiss().then(this.addExercise)
    exerciseModal.present();
  }

  async addExercise(result: OverlayEventDetail){
    if(result.role === 'confirm'){
      if(!this.exercisesControl!.value)
        this.exercisesControl!.setValue([])

      const exercise: IExercise = result.data;
      this.exercisesControl?.value.push(exercise);
    }
  }

  get exercisesControl(){
    return this.form.get('exercises')
  }
}
