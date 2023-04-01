import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TerminadoPageRoutingModule } from './terminado-routing.module';
import { TerminadoPage } from './terminado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TerminadoPageRoutingModule
  ],
  declarations: [TerminadoPage]
})
export class TerminadoPageModule {}
