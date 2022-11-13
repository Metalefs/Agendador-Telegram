import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MessageComponent } from './message.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, SharedModule],
  declarations: [MessageComponent],
  exports: [MessageComponent]
})
export class MessageComponentModule {}
