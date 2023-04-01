import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoAnuncioPageRoutingModule } from './estado-anuncio-routing.module';

import { EstadoAnuncioPage } from './estado-anuncio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EstadoAnuncioPageRoutingModule
  ],
  declarations: [EstadoAnuncioPage]
})
export class EstadoAnuncioPageModule {}
