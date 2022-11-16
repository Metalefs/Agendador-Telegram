import { IActivity } from "./IActivity";
import { IRecipeNutritionDetails } from "./IRecipeNutritionDetails";

export interface IMealActivity extends IActivity{
  mealPrepId?:string;
  recipe?:string;
  details?:IRecipeNutritionDetails;
}
