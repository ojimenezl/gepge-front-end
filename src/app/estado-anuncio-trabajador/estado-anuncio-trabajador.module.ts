import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoAnuncioTrabajadorPageRoutingModule } from './estado-anuncio-trabajador-routing.module';

import { EstadoAnuncioTrabajadorPage } from './estado-anuncio-trabajador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EstadoAnuncioTrabajadorPageRoutingModule
  ],
  declarations: [EstadoAnuncioTrabajadorPage]
})
export class EstadoAnuncioTrabajadorPageModule {}
