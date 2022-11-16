import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewActivityPage } from './view-activity.page';


const routes: Routes = [
  {
    path: '',
    component: ViewActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VieActivityPageRoutingModule {}
