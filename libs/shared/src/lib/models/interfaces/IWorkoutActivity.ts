import { IAudioActivity } from "./IAudioActivity";

export interface IWorkoutActivity extends IAudioActivity {
  group: string;
  exercises: IExercise[];
}

export interface IExercise {
  name:string;
  reps?:number;
  sets?:number;
  load?:IExerciseLoad;
  details:string;
}

export interface IExerciseLoad {
  amount?: number;
  unit?: string;
}
