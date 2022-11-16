import { IActivity } from "./IActivity";
import { IRecipeNutritionDetails } from "./IRecipeNutritionDetails";

export interface IMealPrepActivity extends IActivity{
  recipe?:string;
  details?:IRecipeNutritionDetails;
}
