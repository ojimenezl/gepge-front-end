import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccesoPageRoutingModule } from './acceso-routing.module';
import { AccesoPage } from './acceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AccesoPageRoutingModule
  ],
  declarations: [AccesoPage]
})
export class AccesoPageModule {}
