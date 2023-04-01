import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajesPopPageRoutingModule } from './mensajes-pop-routing.module';

import { MensajesPopPage } from './mensajes-pop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MensajesPopPageRoutingModule
  ],
  declarations: [MensajesPopPage]
})
export class MensajesPopPageModule {}
