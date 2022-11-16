import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectWeekdaysModule } from '../select-weekdays/select-weekdays.module';
import { CleaningFormComponent } from './components/cleaning-form/cleaning-form.component';
import { GroceryshoppingFormComponent } from './components/groceryshopping-form/groceryshopping-form.component';
import { HydrationFormComponent } from './components/hydration-form/hydration-form.component';
import { MealFormComponent } from './components/meal-form/meal-form.component';
import { MealprepFormComponent } from './components/mealprep-form/mealprep-form.component';
import { SleepFormComponent } from './components/sleep-form/sleep-form.component';
import { SupplementFormComponent } from './components/supplement-form/supplement-form.component';
import { AddExerciseComponent } from './components/workout-form/components/add-exercise/add-exercise.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { EditActivityFormComponent } from './edit-activity-form.component';

@NgModule({
  declarations: [
    EditActivityFormComponent,
    GroceryshoppingFormComponent,
    SupplementFormComponent,
    HydrationFormComponent,
    MealprepFormComponent,
    CleaningFormComponent,
    WorkoutFormComponent,
    AddExerciseComponent,
    MealFormComponent,
    SleepFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectWeekdaysModule
  ],
  exports: [
    EditActivityFormComponent
  ]
})
export class EditActivityFormModule { }
